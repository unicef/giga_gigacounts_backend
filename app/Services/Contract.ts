import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

import Contract from 'App/Models/Contract'
import User from 'App/Models/User'
import StatusTransition from 'App/Models/StatusTransition'
import Measure from 'App/Models/Measure'
import Lta from 'App/Models/Lta'
import Metric from 'App/Models/Metric'

import { Exception } from '@adonisjs/core/build/standalone'
import FailedDependencyException from 'App/Exceptions/FailedDependencyException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import InvalidStatusException from 'App/Exceptions/InvalidStatusException'
import SignedMessageException from 'App/Exceptions/SignedMessageException'
import SignWalletException from 'App/Exceptions/SignWalletException'
import UnhandledException from 'App/Exceptions/UnhandledException'

import { roles, ContractStatus, NotificationSources, frequencyNames } from 'App/Helpers/constants'
import userService from 'App/Services/User'
import metricService from 'App/Services/Metric'
import dto, { ContractsStatusCount } from 'App/DTOs/Contract'
import utils from 'App/Helpers/utils'
import Draft from 'App/Models/Draft'
import schoolService from 'App/Services/School'
import Frequency from 'App/Models/Frequency'
import NotificationsService from 'App/Services/Notifications'
import DraftService from 'App/Services/Draft'
import { v1 } from 'uuid'
import Ethers from 'App/Helpers/ethers'

export interface ContractCreation {
  draftId?: number
  countryId: number
  governmentBehalf: boolean
  automatic?: boolean
  name: string
  ltaId: number
  currencyId: number
  budget: number
  startDate: string
  endDate: string
  launchDate: string
  ispId: number
  frequencyId?: number
  schools?: { schools: { id: string; budget: number }[] }
  expectedMetrics: { metrics: { metricId: string; value: number }[] }
  notes?: string
  breakingRules?: string
  paymentReceiverId?: number
}

export interface BatchUpdate {
  confirmedContracts: ContractsMap[]
  ongoingContracts: number[]
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

interface FreqObj {
  formatDate?: string
  frequency?: string
}

const loadContractsDailyMeasures = async () => {
  const contracts = await Contract.query().where('status', ContractStatus.Ongoing).select('id')
  const contractsId: ContractsMap[] = contracts.map(({ id }) => ({ id: id.toString() }))
  await loadContractsMeasures(contractsId, 'daily')

  // Create notification when SLA not met (all de logic is already in bdd!,
  // just left call here by each contract in ongoing state and for the schools getted)

  contractsId.forEach((cId) => {
    NotificationsService.createNotificationByOperation(NotificationSources.slaNotMet, cId.id)
  })
}

const contractStatusBatchUpdate = async (user: User): Promise<BatchUpdate> => {
  const today = DateTime.now()

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

  return { confirmedContracts, ongoingContracts }
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

const getContractSchoolConnectivity = async (user: User) => {
  if (
    !userService.checkUserRole(user, [
      roles.countryMonitor,
      roles.countrySuperAdmin,
      roles.gigaAdmin,
      roles.gigaViewOnly
    ])
  )
    return

  let contracts: Contract[]
  if (userService.checkUserRole(user, [roles.countryMonitor, roles.countrySuperAdmin])) {
    contracts = await Contract.query()
      .preload('expectedMetrics')
      .preload('schools')
      .where('countryId', user.countryId)
  } else {
    contracts = await Contract.query().preload('expectedMetrics').preload('schools')
  }

  if (!contracts.length) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')

  const schoolsMeasures = await getContractSchoolsMeasures(contracts)

  return dto.contractSchoolsDetailsDTO(contracts, schoolsMeasures)
}

const getContract = async (contractId: number) => {
  const contract = await Contract.query()
    .where('id', contractId)
    .preload('country')
    .preload('lta')
    .preload('isp')
    .preload('expectedMetrics')
    .preload('attachments')
    .preload('ispContacts')
    .preload('stakeholders')
    .preload('currency')
    .preload('frequency')
    .preload('schools', (query) => {
      query.pivotColumns(['budget'])
    })
    .preload('paymentReceiver')

  if (!contract.length) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')
  // console.log("Here", contract[0])
  return dto.getContractDTO(contract[0])
}

const getContractDetails = async (contractId: number) => {
  const contract = await Contract.query()
    .where('id', contractId)
    .preload('country')
    .preload('lta')
    .preload('isp')
    .preload('frequency')
    .preload('expectedMetrics')
    .preload('attachments')
    .preload('ispContacts')
    .preload('schools')
    .withAggregate('payments', (qry) => {
      qry.sum('amount').as('total_payments')
    })
    .preload('currency')
    .withCount('schools')
    .withCount('payments')
    .preload('paymentReceiver')

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
  try {
    const { query, draftQuery } = await queryBuilderContract(user)

    let drafts: Draft[] = []
    let contracts: Contract[] = []

    if (status === undefined || status > 0) {
      contracts = await fetchContractList(query, status)
    }

    if (
      (status === undefined || status === 0) &&
      !userService.checkUserRole(user, [roles.schoolConnectivityManager])
    ) {
      drafts = await getDraft(draftQuery)
    }

    // const ltas = await ltaQuery
    const schoolsMeasures = await getContractSchoolsMeasures(contracts)

    // return dto.contractListDTO(contracts, drafts, ltas, schoolsMeasures, status)
    return dto.contractListDTO(contracts, drafts, schoolsMeasures)
  } catch (error) {
    console.log(error)
    if (error.status === 404) throw error
    throw new FailedDependencyException(
      'Some database error occurred while read contracts',
      424,
      'DATABASE_ERROR'
    )
  }
}

const destructObjArrayWithId = (object?: { id: string; budget: number }[]) => {
  return (object || []).map(({ id, budget }) => ({ id, budget }))
}
const createContract = async (data: ContractCreation, user: User): Promise<Contract> => {
  const trx = await Database.transaction()
  try {
    const frequency = await Frequency.findBy('name', 'Monthly')

    const contract = await Contract.create(
      {
        countryId: data.countryId,
        name: data.name,
        ltaId: data.ltaId,
        currencyId: data.currencyId,
        budget: data.budget,
        ispId: data.ispId,
        automatic: data.automatic,
        status: ContractStatus.Sent,
        governmentBehalf: DraftService.isGovernmentBehalf(user, data.governmentBehalf),
        startDate: utils.formatContractDate(data.startDate, true),
        endDate: utils.formatContractDate(data.endDate),
        launchDate: utils.formatContractDate(data.launchDate),
        createdBy: user.id,
        frequencyId: data.frequencyId || frequency?.id,
        notes: data.notes,
        breakingRules: data.breakingRules,
        paymentReceiverId: data.paymentReceiverId || undefined
      },
      { client: trx }
    )

    // SCHOOLS
    const schools = data?.schools?.schools
    const destructedSchools = destructObjArrayWithId(schools)

    for (const school of destructedSchools) {
      await contract.related('schools').attach({ [school.id]: { budget: school.budget } }), trx
    }

    // EXPECTED METRICS
    const expectedMetrics = data.expectedMetrics.metrics
    await metricService.createExpectedMetrics(expectedMetrics, contract.id, trx)

    if (data.draftId) {
      const draft = await Draft.findBy('id', data.draftId, { client: trx })
      if (!draft) throw new NotFoundException('Draft not found', 404, 'NOT_FOUND')

      // ATTACHMENTS
      await draft.load('attachments')
      await contract.related('attachments').attach(
        draft.attachments.map(({ id }) => id),
        trx
      )
      await draft.useTransaction(trx).related('attachments').detach()

      await draft.load('ispContacts')
      await contract.related('ispContacts').attach(
        draft.ispContacts.map(({ id }) => id),
        trx
      )
      await draft.useTransaction(trx).related('ispContacts').detach()

      await StatusTransition.create(
        {
          who: user.id,
          contractId: contract.id.toString(),
          initialStatus: ContractStatus.Draft,
          finalStatus: ContractStatus.Sent,
          data: {
            draftCreation: draft.createdAt
          }
        },
        { client: trx }
      )

      await draft.useTransaction(trx).delete()
    }

    await trx.commit()

    NotificationsService.createNotificationByOperation(
      contract.automatic
        ? NotificationSources.automaticContractCreation
        : NotificationSources.manualContractCreation,
      contract.id?.toString() || '0'
    )

    return contract
  } catch (error) {
    console.log(error)
    await trx.rollback()
    if (error.status === 404) throw error
    throw new FailedDependencyException(
      'Some database error occurred while creating contract',
      424,
      'DATABASE_ERROR'
    )
  }
}

const getContractsCountByStatus = async (
  user?: User
): Promise<ContractsStatusCount | undefined> => {
  if (!user) return

  const { query, draftQuery } = await queryBuilderContract(user)

  const totalCount = await query.count('*')
  const contracts = await query.select('status').distinct('status').groupBy('status').count('*')
  const drafts = await draftQuery.count('*')
  return dto.contractCountByStatusDTO(
    contracts,
    totalCount[0].$extras.count,
    drafts[0].$extras.count
  )
}

const queryBuilderContract = async (
  user: User
): Promise<{
  query: ModelQueryBuilderContract<typeof Contract, Contract>
  draftQuery: ModelQueryBuilderContract<typeof Draft, Draft>
  ltaQuery: ModelQueryBuilderContract<typeof Lta, Lta>
}> => {
  let query = Contract.query()
  let draftQuery = Draft.query()
  let ltaQuery = Lta.query()

  if (userService.checkUserRole(user, [roles.gigaAdmin, roles.gigaViewOnly])) {
    // [roles.gigaAdmin, roles.gigaViewOnly] these roles see all contracts for all countries.
  } else {
    // The rest of roles, need to see contracts related to their respective countries.
    query.where('countryId', user.countryId)
    draftQuery.where('countryId', user.countryId)
    ltaQuery.where('countryId', user.countryId)

    // filter contracts for country related roles.
    if (
      userService.checkUserRole(user, [
        roles.countryContractCreator,
        roles.countryAccountant,
        roles.countrySuperAdmin,
        roles.countryMonitor
      ])
    ) {
      query.andWhere('governmentBehalf', true)
      draftQuery.andWhere('governmentBehalf', true)
    }

    // filter contracts for ISP related roles.
    if (userService.checkUserRole(user, [roles.ispContractManager, roles.ispCustomerService])) {
      await user.load('isp')
      query.whereHas('isp', (qry) => {
        qry.where('isp_id', user.isp[0].id)
      })
      draftQuery.whereHas('isp', (qry) => {
        qry.where('isp_id', user.isp[0].id)
      })
      ltaQuery.whereHas('isps', (qry) => {
        qry.where('isp_id', user.isp[0].id)
      })
    }

    // filter contracts for School related roles.
    if (userService.checkUserRole(user, [roles.schoolConnectivityManager])) {
      await user.load('school')
      query.whereHas('schools', (qry) => {
        qry.where('school_id', user.school[0].id)
      })
      // The School can't see draft contracts
    }
  }

  // Load currency relationship
  query.preload('currency').preload('frequency')
  draftQuery.preload('currency').preload('frequency')

  return { query, draftQuery, ltaQuery }
}

const publishContract = async (contractId: number, userId?: number) => {
  return changeStatus(contractId, ContractStatus.Sent, userId)
}

const approveContract = async (contractId: number, userId?: number) => {
  return changeStatus(contractId, ContractStatus.Confirmed, userId)
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
        finalStatus: newStatus
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
      'Some database error occurred while updating contract status',
      424,
      'DATABASE_ERROR'
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
  const startDate = type === 'daily' ? DateTime.now().startOf('day') : undefined
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
    (metrics = await Metric.all())
  ])
  const schoolsIds = contract.schools.map(({ id }) => id)
  return schoolService.loadSchoolsMeasures(
    schoolsIds,
    contract.id,
    contract.country.code,
    startDate!,
    startDate!,
    metrics,
    type
  )
}

// const defineMeasuresEndDate = (contactEndDate: DateTime) => {
//   // THE DATE IS INCREASE HERE BECAUSE UNICEF API END_DATE IS NOT INCLUSIVE
//   const today = utils.setDateToBeginOfDayFromISO(DateTime.now().plus({ day: 1 }))
//   const endDate = utils.setDateToBeginOfDayFromISO(contactEndDate.plus({ day: 1 }))
//   return endDate > today ? today : endDate
// }

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
        finalStatus
      })
    )
  )
}

const getContractAvailablePayments = async (contractId: string) => {
  const contract = await Contract.query()
    .where('id', contractId)
    .preload('payments')
    .preload('frequency')
  if (!contract.length) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')
  const endMonth = DateTime.now().endOf('month')

  let endDate: DateTime | string = endMonth > contract[0].endDate ? contract[0].endDate : endMonth

  const startDate = contract[0].launchDate.toISODate()

  if (contract[0].startDate.get('day') > endDate.get('day')) {
    endDate = endDate.set({ day: contract[0].startDate.get('day') }).toISODate() as string
  }
  const diff = Math.floor(
    utils.diffOfDays(contract[0].startDate, contract[0].startDate.startOf('month')).days
  )

  let frequency = contract[0].frequency.name
  let freqObject: FreqObj = {}

  if (frequency === frequencyNames.Weekly) {
    freqObject.formatDate = 'DD-MM-YYYY'
    freqObject.frequency = '1 week'
  } else if (frequency === frequencyNames.Biweekly) {
    freqObject.formatDate = 'DD-MM-YYYY'
    freqObject.frequency = '2 week'
  } else {
    freqObject.formatDate = 'MM-YYYY'
    freqObject.frequency = '1 month'
  }
  const payments = await Database.rawQuery(
    `select to_char(months, '${freqObject.formatDate}') as dates
      from generate_series(
        '${startDate}'::DATE,
        '${endDate}'::DATE,
        '${freqObject.frequency}'
      ) as months
      where months::date - ${diff} not in (
        select date_from::date from payments where contract_id = ${contract[0].id}
      )
      and months::date not in (
        select date_from::date from payments where contract_id = ${contract[0].id}
      )
      order by extract(year from months) asc, extract(month from months) asc
    `
  )

  return dto.contractAvailablePaymentsDTO(payments.rows)
}

const duplicateContract = async (contractId, user: User) => {
  if (!userService.checkUserRole(user, [roles.gigaAdmin, roles.ispContractManager]))
    throw new InvalidStatusException(
      'The current user does not have the required permissions to duplicate the contract.',
      401,
      'E_UNAUTHORIZED_ACCESS'
    )

  const trx = await Database.transaction()
  try {
    const contract = await Contract.query().where('id', contractId)
    const completeContract = await getContract(contractId)
    if (!contract.length) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')
    if (!completeContract)
      throw new UnhandledException('Contract is not completed', 400, 'NOT_FOUND')

    let contractName = contract[0].name
    var regex = /(\d+)/g

    const contractNames = await Draft.query().whereILike('name', `%${contractName}%`)

    if (contractNames.length >= 1) {
      let clauseValidation = contractNames.slice(-1)[0].name.match(regex)
      if ((clauseValidation?.length as number) > 1) {
        let newNumber = Number(contractNames.slice(-1)[0].name.split(' ').slice(-1)) + 1

        contractName = `${contract[0].name} - Copy ${newNumber}`
      } else {
        contractName = `${contract[0].name} - Copy 1`
      }
    } else {
      contractName = `${contract[0].name} - Copy`
    }

    // SCHOOLS
    const schools = completeContract?.schools
    const destructedSchools = schools.map((sc) => {
      return { external_id: sc.externalId, budget: sc.budget }
    })

    // EXPECTED METRICS
    const expectedMetrics = completeContract.expectedMetrics.map((em) => {
      return { metricId: em.metricId.toString(), value: em.value }
    })

    const draft = await Draft.create({
      name: contractName,
      countryId: contract[0].countryId,
      ltaId: contract[0].ltaId,
      currencyId: contract[0].currencyId,
      budget: contract[0].budget,
      frequencyId: contract[0].frequencyId,
      ispId: contract[0].ispId,
      automatic: contract[0].automatic,
      createdBy: user.id,
      schools: {
        schools: destructedSchools
      },
      expectedMetrics: {
        metrics: expectedMetrics
      },
      governmentBehalf: DraftService.isGovernmentBehalf(user, contract[0].governmentBehalf),
      startDate: contract[0].startDate,
      endDate: contract[0].endDate,
      launchDate: contract[0].launchDate,
      notes: contract[0].notes,
      breakingRules: contract[0].breakingRules
    })

    await trx.commit()
    return draft
  } catch (error) {
    await trx.rollback()
    console.log(error)
    if (error instanceof Exception) throw error
    throw new UnhandledException(error.message, 400, error.code)
  }
}

const generateSignContractRandomString = async (contractId: number) => {
  if (!contractId || contractId === 0)
    throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')
  const contracts = await Contract.query().where('id', contractId)
  if (!contracts.length) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')
  const randomString = `This is a verification message to sign contract. Please sign it with your wallet.\n${v1()}`
  const trx = await Database.transaction()

  try {
    const contract = contracts[0]
    contract.signRequestString = randomString
    await contract.save()
    await trx.commit()
    return randomString
  } catch (error) {
    await trx.rollback()
    console.log(error)
    if (error instanceof Exception) throw error
    throw new UnhandledException(error.message, 400, error.code)
  }
}

const signContractWithWallet = async (
  contractId: number,
  walletAddress: string,
  signatureHash: string,
  user: User
) => {
  if (!contractId || contractId === 0)
    throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')
  if (!walletAddress) throw new NotFoundException('Wallet could net be emtpy', 404, 'NOT_FOUND')
  if (!signatureHash)
    throw new NotFoundException('Signature Hash could not be emtpy', 404, 'NOT_FOUND')

  const contracts = await Contract.query().where('id', contractId)
  if (!contracts.length) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')
  if (
    !(
      user.walletAddress &&
      user.walletAddress.toLocaleLowerCase() === walletAddress.toLocaleLowerCase()
    )
  )
    throw new SignWalletException(
      'the wallet with which you want to sign the contract is different from the one verified by the user',
      400,
      'INVALID_WALLET'
    )

  const trx = await Database.transaction()

  try {
    const contract = contracts[0]
    if (
      Ethers.recoverAddress(contract.signRequestString!, signatureHash).toLocaleLowerCase() !==
      walletAddress.toLocaleLowerCase()
    ) {
      throw new SignedMessageException('Invalid signed message', 400, 'INVALID_SIGNATURE_HASH')
    }

    contract.signedWalletAddress = walletAddress
    contract.signedWithWallet = true
    await contract.save()
    await trx.commit()
    return contract
  } catch (error) {
    await trx.rollback()
    console.log(error.message, error.reason, error.code, error.status)
    if (error?.code === '23505')
      throw new SignedMessageException('Wallet address is incorrect', 400, 'INCORRECT_WALLET')
    if (error instanceof Exception) throw error
    throw new UnhandledException(error.message, 400, error.code)
  }
}

export default {
  getContractsCountByStatus,
  createContract,
  getContractList,
  changeStatus,
  getContractDetails,
  getContractSchools,
  getContractSchoolConnectivity,
  getContract,
  contractStatusBatchUpdate,
  loadContractsDailyMeasures,
  getContractSchoolsMeasures,
  getContractAvailablePayments,
  duplicateContract,
  generateSignContractRandomString,
  signContractWithWallet,
  publishContract,
  approveContract
}
