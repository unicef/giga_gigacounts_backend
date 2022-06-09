import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import Contract from 'App/Models/Contract'
import User from 'App/Models/User'
import FailedDependencyException from 'App/Exceptions/FailedDependencyException'

import { roles, ContractStatus } from 'App/Helpers/constants'
import userService from 'App/Services/User'
import metricService from 'App/Services/Metric'
import dto, { ContractsStatusCount } from 'App/DTOs/Contract'
import utils from 'App/Helpers/utils'
import Draft from 'App/Models/Draft'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

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
  attachments?: { attachments: { id: number }[] }
  schools: { schools: { id: number }[] }
  expectedMetrics: { metrics: { metricId: number; value: number }[] }
}

const getContractList = async (user: User) => {
  const { query, draftQuery } = await something(user)

  const contracts = await query
    .preload('country')
    .preload('lta')
    .preload('isp')
    .preload('expectedMetrics')
    .preload('payments')
    .preload('schools', (builder) => {
      builder.preload('measures')
    })
    .withCount('schools') // c.$extras.schools_count

  dto.contractListDTO(contracts)
  return contracts
}

const createContract = async (data: ContractCreation): Promise<Contract> => {
  const trx = await Database.transaction()
  try {
    const contract = await Contract.create(
      { ...utils.removeProperty(data, 'draftId'), status: ContractStatus.Sent },
      { client: trx }
    )

    const attachments = data.attachments?.attachments || []
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
      await draft?.delete()
    }

    await trx.commit()

    return contract
  } catch (error) {
    await trx.rollback()
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
  let query = Contract.query()
  let draftQuery = Draft.query()

  if (!userService.checkUserRole(user, [roles.gigaAdmin])) {
    query.where('countryId', user.countryId)
    draftQuery.where('countryId', user.countryId)

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
    }
  }

  const totalCount = await query.count('*')
  const contracts = await query.select('status').distinct('status').groupBy('status').count('*')
  const drafts = await draftQuery.count('*')
  return dto.contractCountByStatusDTO(
    contracts,
    totalCount[0].$extras.count,
    drafts[0].$extras.count
  )
}

const something = async (
  user: User
): Promise<{
  query: ModelQueryBuilderContract<typeof Contract, Contract>
  draftQuery: ModelQueryBuilderContract<typeof Draft, Draft>
}> => {
  let query = Contract.query()
  let draftQuery = Draft.query()

  if (!userService.checkUserRole(user, [roles.gigaAdmin])) {
    query.where('countryId', user.countryId)
    draftQuery.where('countryId', user.countryId)

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
    }
  }

  return { query, draftQuery }
}

export default {
  getContractsCountByStatus,
  createContract,
  getContractList,
}
