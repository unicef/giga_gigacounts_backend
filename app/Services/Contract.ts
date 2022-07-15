import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import Contract from 'App/Models/Contract'
import User from 'App/Models/User'
import StatusTransition from 'App/Models/StatusTransition'

import FailedDependencyException from 'App/Exceptions/FailedDependencyException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import InvalidStatusException from 'App/Exceptions/InvalidStatusException'

import { roles, ContractStatus } from 'App/Helpers/constants'
import userService from 'App/Services/User'
import metricService from 'App/Services/Metric'
import dto, { ContractsStatusCount } from 'App/DTOs/Contract'
import utils from 'App/Helpers/utils'
import Draft from 'App/Models/Draft'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Measure from 'App/Models/Measure'
import Lta from 'App/Models/Lta'

export interface ContractCreation {
  draftId?: number
  countryId: number
  governmentBehalf: boolean
  name: string
  ltaId: number
  currencyId: number
  budget: string
  frequencyId: number
  startDate: DateTime
  endDate: DateTime
  ispId: number
  createdBy: number
  attachments?: { id: number }[]
  schools: { schools: { id: number }[] }
  expectedMetrics: { metrics: { metricId: number; value: number }[] }
}

const getContractSchools = async (contractId: number) => {
  const contract = await Contract.query()
    .where('id', contractId)
    .preload('country')
    .preload('lta')
    .preload('isp')
    .preload('expectedMetrics')
    .preload('attachments')
    .preload('schools')
    .withCount('schools')

  if (!contract.length) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')

  const schoolsMeasures = await getContractSchoolsMeasures(contract)

  return dto.contractSchoolsDetailDTO(contract[0], schoolsMeasures)
}

const getContract = async (contractId: number) => {
  const contract = await Contract.query()
    .where('id', contractId)
    .preload('country')
    .preload('lta')
    .preload('isp')
    .preload('expectedMetrics')
    .preload('attachments')
    .preload('schools')

  if (!contract.length) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')

  return dto.getContractDTO(contract[0])
}

const getContractDetails = async (contractId: number) => {
  const contract = await Contract.query()
    .where('id', contractId)
    .preload('country')
    .preload('lta')
    .preload('isp')
    .preload('expectedMetrics')
    .preload('attachments')
    .preload('schools')
    .withCount('schools')

  if (!contract.length) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')

  const schoolsMeasures = await getContractSchoolsMeasures(contract)

  const connectionsMedian = await Database.rawQuery(
    // eslint-disable-next-line max-len
    'SELECT contract_id, metric_id, Metrics.name as metric_name, Metrics.unit as unit,PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) as median_value from Measures INNER JOIN Metrics ON Metrics.id=metric_id where contract_id = ? GROUP BY contract_id, metric_id, metric_name, unit',
    [contract[0].id]
  )

  return dto.contractDeatilsDTO(contract[0], schoolsMeasures, connectionsMedian.rows)
}

const getContractList = async (user: User) => {
  const { query, draftQuery, ltaQuery } = await queryBuilder(user)

  const contracts = await query
    .preload('country')
    .preload('lta')
    .preload('isp')
    .preload('expectedMetrics', (qry) => qry.preload('metric'))
    .withAggregate('payments', (qry) => {
      qry.sum('amount').as('total_payments')
    })
    .preload('schools')
    .withCount('schools')

  const drafts = await draftQuery.preload('country').preload('lta').preload('isp')

  const ltas = await ltaQuery

  const schoolsMeasures = await getContractSchoolsMeasures(contracts)

  return dto.contractListDTO(contracts, drafts, ltas, schoolsMeasures)
}

const createContract = async (data: ContractCreation): Promise<Contract> => {
  const trx = await Database.transaction()
  try {
    const contract = await Contract.create(
      { ...utils.removeProperty(data, 'draftId'), status: ContractStatus.Sent },
      { client: trx }
    )

    const attachments = data?.attachments || []
    const schools = data.schools.schools
    const expectedMetrics = data.expectedMetrics.metrics
    // ATTACHMENTS
    await contract.related('attachments').attach(utils.destructObjArrayWithId(attachments), trx)
    // SCHOOLS
    await contract.related('schools').attach(utils.destructObjArrayWithId(schools), trx)
    // EXPECTED METRICS
    await metricService.createExpectedMetrics(expectedMetrics, contract.id, trx)

    if (data.draftId) {
      const draft = await Draft.findBy('id', data.draftId, { client: trx })
      if (!draft) throw new NotFoundException('Draft not found', 404, 'NOT_FOUND')

      await draft.useTransaction(trx).related('attachments').detach()

      await StatusTransition.create(
        {
          who: data.createdBy,
          contractId: contract.id,
          initialStatus: ContractStatus.Draft,
          finalStatus: ContractStatus.Sent,
          data: {
            draftCreation: draft.createdAt,
          },
        },
        { client: trx }
      )

      await draft.useTransaction(trx).delete()
    }

    await trx.commit()

    return contract
  } catch (error) {
    await trx.rollback()
    if (error.status === 404) throw error
    throw new FailedDependencyException(
      'Some dependency failed while creating contract',
      424,
      'FAILED_DEPENDENCY'
    )
  }
}

const getContractsCountByStatus = async (
  user?: User
): Promise<ContractsStatusCount | undefined> => {
  if (!user) return

  const { query, draftQuery } = await queryBuilder(user)

  const totalCount = await query.count('*')
  const contracts = await query.select('status').distinct('status').groupBy('status').count('*')
  const drafts = await draftQuery.count('*')
  return dto.contractCountByStatusDTO(
    contracts,
    totalCount[0].$extras.count,
    drafts[0].$extras.count
  )
}

const queryBuilder = async (
  user: User
): Promise<{
  query: ModelQueryBuilderContract<typeof Contract, Contract>
  draftQuery: ModelQueryBuilderContract<typeof Draft, Draft>
  ltaQuery: ModelQueryBuilderContract<typeof Lta, Lta>
}> => {
  let query = Contract.query()
  let draftQuery = Draft.query()
  let ltaQuery = Lta.query()

  if (!userService.checkUserRole(user, [roles.gigaAdmin])) {
    query.where('countryId', user.countryId)
    draftQuery.where('countryId', user.countryId)
    ltaQuery.where('countryId', user.countryId)

    if (userService.checkUserRole(user, [roles.government])) {
      query.andWhere('governmentBehalf', true)
      draftQuery.andWhere('governmentBehalf', true)
    }

    if (userService.checkUserRole(user, [roles.isp])) {
      query.whereHas('isp', (qry) => {
        qry.where('name', user.name)
      })
      draftQuery.whereHas('isp', (qry) => {
        qry.where('name', user.name)
      })
      ltaQuery.whereHas('isps', (qry) => {
        qry.where('name', user.name)
      })
    }
  }

  return { query, draftQuery, ltaQuery }
}

const changeStatus = async (contractId: number, newStatus: ContractStatus, userId?: number) => {
  if (!userId) return
  const trx = await Database.transaction()
  try {
    const contract = await Contract.find(contractId, { client: trx })

    if (!contract) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')

    let oldStatus = contract.status
    if (oldStatus + 1 !== newStatus || !(newStatus in ContractStatus)) {
      throw new InvalidStatusException('Invalid status', 400, 'INVALID_STATUS')
    }

    await StatusTransition.create(
      {
        who: userId,
        contractId: contract.id,
        initialStatus: oldStatus,
        finalStatus: newStatus,
      },
      { client: trx }
    )

    contract.status = newStatus
    await contract.useTransaction(trx).save()

    await trx.commit()
    return contract
  } catch (error) {
    await trx.rollback()
    if (error) throw error
    throw new FailedDependencyException(
      'Some dependency failed while updating contract status',
      424,
      'FAILED_DEPENDENCY'
    )
  }
}

const getContractSchoolsMeasures = async (contracts: Contract[]) => {
  const schoolsMeasures = {}

  for (const contract of contracts) {
    if (!contract.schools?.length) continue
    schoolsMeasures[contract.name] = {}
    for (const school of contract.schools) {
      schoolsMeasures[contract.name][school.name] = await Measure.query()
        .avg('value')
        .where('school_id', school.id)
        .andWhere('contract_id', contract.id)
        .select('metric_id')
        .groupBy('metric_id')
    }
  }

  return schoolsMeasures
}

export default {
  getContractsCountByStatus,
  createContract,
  getContractList,
  changeStatus,
  getContractDetails,
  getContractSchools,
  getContract,
}
