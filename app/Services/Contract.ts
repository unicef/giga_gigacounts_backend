import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

import Contract from 'App/Models/Contract'
import User from 'App/Models/User'
import StatusTransition from 'App/Models/StatusTransition'
import Measure from 'App/Models/Measure'
import Lta from 'App/Models/Lta'
import Metric from 'App/Models/Metric'

import FailedDependencyException from 'App/Exceptions/FailedDependencyException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import InvalidStatusException from 'App/Exceptions/InvalidStatusException'

import { roles, ContractStatus } from 'App/Helpers/constants'
import userService from 'App/Services/User'
import metricService from 'App/Services/Metric'
import dto, { ContractsStatusCount } from 'App/DTOs/Contract'
import utils from 'App/Helpers/utils'
import Draft from 'App/Models/Draft'
import schoolService from 'App/Services/School'
import Frequency from 'App/Models/Frequency'

export interface ContractCreation {
  draftId?: number
  countryId: number
  governmentBehalf: boolean
  name: string
  ltaId: number
  currencyId: number
  budget: string
  startDate: string
  endDate: string
  ispId: number
  attachments?: { id: string }[]
  schools: { schools: { id: string }[] }
  expectedMetrics: { metrics: { metricId: string; value: number }[] }
}

export interface BatchUpdate {
  confirmedContracts: ContractsMap[]
  ongoingContracts: number[]
  sentContracts: number[]
}

export type LoadMeasuresType = 'daily' | 'historic'

interface ContractsMap {
  id: string
}

export interface StatusTransitionData {
  who: number
  contractId: number
  initialStatus: number
  finalStatus: number
  data: Object
}

const loadContractsDailyMeasures = async () => {
  const contracts = await Contract.query().where('status', ContractStatus.Ongoing).select('id')
  const contractsId: ContractsMap[] = contracts.map(({ id }) => ({ id: id.toString() }))
  loadContractsMeasures(contractsId, 'daily')
}

const contractStatusBatchUpdate = async (user: User): Promise<BatchUpdate> => {
  const today = DateTime.now()

  const sentContracts = await Contract.query()
    .where('status', ContractStatus.Sent)
    .update('status', ContractStatus.Confirmed, ['id'])

  await batchStatusTransitions(
    sentContracts,
    user.id,
    ContractStatus.Sent,
    ContractStatus.Confirmed
  )

  const confirmedContracts = await Contract.query()
    .where('status', ContractStatus.Confirmed)
    .andWhere('start_date', '<=', today.toString())
    .update('status', ContractStatus.Ongoing, ['id'])

  await batchStatusTransitions(
    confirmedContracts,
    user.id,
    ContractStatus.Confirmed,
    ContractStatus.Ongoing
  )

  const ongoingContracts = await Contract.query()
    .where('status', ContractStatus.Ongoing)
    .andWhere('end_date', '<=', today.toString())
    .update('status', ContractStatus.Expired, ['id'])

  await batchStatusTransitions(
    ongoingContracts,
    user.id,
    ContractStatus.Ongoing,
    ContractStatus.Expired
  )

  if (confirmedContracts.length > 0) loadContractsMeasures(confirmedContracts, 'historic')

  return { sentContracts, confirmedContracts, ongoingContracts }
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
    .preload('currency')

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
    .withAggregate('payments', (qry) => {
      qry.sum('amount').as('total_payments')
    })
    .preload('currency')
    .withCount('schools')
    .withCount('payments')

  if (!contract.length) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')

  const schoolsMeasures = await getContractSchoolsMeasures(contract)

  const connectionsMedian = await Database.rawQuery(
    // eslint-disable-next-line max-len
    'SELECT contract_id, metric_id, Metrics.name as metric_name, Metrics.unit as unit,PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) as median_value from Measures INNER JOIN Metrics ON Metrics.id=metric_id where contract_id = ? GROUP BY contract_id, metric_id, metric_name, unit',
    [contract[0].id]
  )

  return dto.contractDeatilsDTO(contract[0], schoolsMeasures, connectionsMedian.rows)
}

const getContractList = async (user: User, status?: number) => {
  const { query, draftQuery, ltaQuery } = await queryBuilder(user)
  let drafts: Draft[] = []
  let contracts: Contract[] = []

  if (status === undefined || status > 0) {
    contracts = await fetchContractList(query, status)
  }

  if (status === undefined || status === 0) {
    drafts = await getDraft(draftQuery)
  }

  const ltas = await ltaQuery

  const schoolsMeasures = await getContractSchoolsMeasures(contracts)

  return dto.contractListDTO(contracts, drafts, ltas, schoolsMeasures)
}

const createContract = async (data: ContractCreation, user: User): Promise<Contract> => {
  const trx = await Database.transaction()
  try {
    const frequency = await Frequency.findBy('name', 'Monthly')

    const contract = await Contract.create(
      {
        ...utils.removeProperty(data, 'draftId'),
        status: ContractStatus.Sent,
        governmentBehalf: userService.checkUserRole(user, [roles.government])
          ? true
          : data.governmentBehalf,
        startDate: utils.formatContractDate(data.startDate, true),
        endDate: utils.formatContractDate(data.endDate),
        createdBy: user.id,
        frequencyId: frequency?.id || 2,
      },
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
          who: user.id,
          contractId: contract.id.toString(),
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
        contractId: contract.id.toString(),
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

const getDraft = async (query: ModelQueryBuilderContract<typeof Draft, Draft>) => {
  return query.preload('country').preload('lta').preload('isp')
}

const fetchContractList = async (
  query: ModelQueryBuilderContract<typeof Contract, Contract>,
  status?: number
) => {
  if (status) {
    query.where('status', status)
  }
  return query
    .preload('country')
    .preload('lta')
    .preload('isp')
    .preload('expectedMetrics', (qry) => qry.preload('metric'))
    .withAggregate('payments', (qry) => {
      qry.sum('amount').as('total_payments')
    })
    .preload('schools')
    .withCount('schools')
}

export const loadContractsMeasures = async (
  contractIds: ContractsMap[],
  type: LoadMeasuresType
) => {
  const startDate = type === 'daily' ? DateTime.now().startOf('month') : undefined
  return Promise.all(
    contractIds.map(({ id }) => {
      loadContractMeasures(parseInt(id), type, startDate)
    })
  )
}

const loadContractMeasures = async (
  contractId: number,
  type: LoadMeasuresType,
  startDate?: DateTime
) => {
  const contract = await Contract.find(contractId)
  if (!contract) return
  let metrics: Metric[]
  await Promise.all([
    contract.load('country'),
    contract.load('schools'),
    (metrics = await Metric.all()),
  ])
  const schoolsIds = contract.schools.map(({ id }) => id)
  return schoolService.loadSchoolsMeasures(
    schoolsIds,
    contract.id,
    contract.country.code,
    startDate || contract.startDate,
    defineMeasuresEndDate(contract.endDate),
    metrics,
    type
  )
}

const defineMeasuresEndDate = (contactEndDate: DateTime) => {
  // THE DATE IS INCREASE HERE BECAUSE UNICEF API END_DATE IS NOT INCLUSIVE
  const today = utils.setDateToBeginOfDayFromISO(DateTime.now().plus({ day: 1 }))
  const endDate = utils.setDateToBeginOfDayFromISO(contactEndDate.plus({ day: 1 }))
  return endDate > today ? today : endDate
}

const batchStatusTransitions = async (
  contractIds: { id: string }[],
  who: number,
  initialStatus: ContractStatus,
  finalStatus: ContractStatus
) => {
  return Promise.all(
    contractIds.map(({ id }) =>
      StatusTransition.create({
        who,
        contractId: id,
        initialStatus,
        finalStatus,
      })
    )
  )
}

export default {
  getContractsCountByStatus,
  createContract,
  getContractList,
  changeStatus,
  getContractDetails,
  getContractSchools,
  getContract,
  contractStatusBatchUpdate,
  loadContractsDailyMeasures,
  getContractSchoolsMeasures,
}
