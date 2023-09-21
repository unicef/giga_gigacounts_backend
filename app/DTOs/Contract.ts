import Contract from 'App/Models/Contract'
import Draft from 'App/Models/Draft'
import ExpectedMetric from 'App/Models/ExpectedMetric'

import { ContractStatus, CurrencyType } from 'App/Helpers/constants'
import utils from 'App/Helpers/utils'
import { DateTime } from 'luxon'
import { v1 } from 'uuid'
import Frequency from 'App/Models/Frequency'

interface StatusCount {
  status: string
  count: any
}

export interface ContractsStatusCount {
  counts: StatusCount[]
  totalCount: number
}

export interface ContractListDTO {
  contracts: ContractList[]
}

interface ContractList {
  id: number
  listId: string
  name: string
  isp?: string
  frequency: Frequency
  start_date?: DateTime
  end_date?: DateTime
  status: string
  country?: {
    name: string
    code: string
    flagUrl: string
  }
  schoolsConnection?: SchoolsConnection
  numberOfSchools?: number
  amount?: number
  totalSpent?: number
  lta?: {
    id: number
    name: string
  }
  notes?: string
  breakingRules?: string
  cashback?: number
}

export interface SchoolsConnection {
  withoutConnection: number
  atLeastOneBellowAvg: number
  allEqualOrAboveAvg: number
}

export interface ConnectionMedian {
  contract_id: number
  metric_id: number
  median_value: number
  metric_name: string
  unit: string
}

export interface ContractDetails {
  id: number
  name: string
  isp: string
  frequency: Frequency
  automatic: boolean
  signedWithWallet?: boolean
  signedWalletAddress?: string
  lta?: {
    id: number
    name: string
  }
  startDate: DateTime
  endDate: DateTime
  launchDate: DateTime
  status: string
  country?: {
    name: string
    code: string
    flagUrl: string
  }
  expectedMetrics: {
    metricId: number
    metricName: string
    metricUnit: string
    value: number
  }[]
  schools?: {
    schooldId: number
    budget: string
  }[]
  schoolsConnection?: SchoolsConnection
  numberOfSchools?: number
  attachments?: {
    id: number
    url: string
    ipfs_url?: string
    name: string
  }[]
  ispContacts?: {
    id: number
    name: string
    email: string
    lastName: string
    role: {
      name?: string
      code?: string
    }
  }[]
  stakeholders?: {
    id: number
    name: string
    email: string
    lastName: string
    role: {
      name?: string
      code?: string
    }
  }[]
  connectionsMedian: ConnectionMedian[]
  budget: number
  numberOfPayments: number
  notes?: string
  breakingRules?: string
  cashback?: number
  currency: {
    id: string
    name: string
    code: string
    type: string
  }
  totalSpent: {
    amount: string
    percentage: number
  }
  paymentReceiver?: {
    id: number
    name: string
    email: string
    lastName: string
  }
}

interface ConnectionEquation {
  'value': number
  'Uptime': number
  'Latency': number
  'Download speed': number
  'Upload speed': number
}

interface ContactInformation {
  contactPerson: string
  email: string
  phoneNumber: string
}

export interface ContractSchoolsDetail {
  id: number
  name: string
  budget?: number
  externalId: string
  locations: string
  educationLevel?: string
  connection: ConnectionEquation
  contactInformation?: ContactInformation
}

export interface ContractDTO {
  id: number
  name: string
  isp: string
  frequency: Frequency
  automatic: boolean
  signedWithWallet?: boolean
  signedWalletAddress?: string
  lta?: {
    id: number
    name: string
  }
  attachments?: {
    id: number
    url: string
    ipfs_url?: string
    name: string
  }[]
  ispContacts?: {
    id: number
    name: string
    email: string
    lastName: string
    role: {
      name?: string
      code?: string
    }
  }[]
  stakeholders?: {
    id: number
    name: string
    email: string
    lastName: string
    role: {
      name?: string
      code?: string
    }
  }[]
  startDate: DateTime
  endDate: DateTime
  launchDate: DateTime
  status: string
  country?: {
    name: string
    code: string
    flagUrl: string
  }
  expectedMetrics: {
    metricId: number
    metricName: string
    metricUnit: string
    value: number
  }[]
  budget: number
  currency: {
    id: string
    name: string
    code: string
    type: string
  }
  schools: {
    id: string
    externalId: string
    name: string
    locations: string
    educationLevel: string
    geopoint: string
    email: string
    phoneNumber: string
    contactPerson: string
    gigaIdSchool: string
    budget: number
    reliableMeasures: boolean
  }[]
  notes?: string
  breakingRules?: string
  cashback?: number
  paymentReceiver?: {
    id: number
    name: string
    email: string
    lastName: string
  }
}

const contractSchoolsDetailDTO = async (contract: Contract, schoolsMeasures: {}) => {
  const schools: ContractSchoolsDetail[] = []
  if (contract.schools.length) {
    for (const school of contract.schools) {
      const connection = await calculateSchoolsMeasure(
        schoolsMeasures[contract.name][school.name],
        contract.expectedMetrics
      )

      const contactInformation: ContactInformation = {
        contactPerson: school.contactPerson,
        email: school.email,
        phoneNumber: school.phoneNumber
      }

      schools.push({
        id: school.id,
        name: school.name,
        budget: school.$extras.pivot_budget,
        externalId: school.externalId,
        locations: concatLocations([
          school?.location1,
          school?.location2,
          school?.location3,
          school?.location4
        ]),
        educationLevel: school.educationLevel,
        connection,
        contactInformation
      })
    }
  }
  return schools
}

const contractSchoolsDetailsDTO = async (contracts: Contract[], schoolsMeasures: {}) => {
  const schools: ContractSchoolsDetail[] = []
  for (const c of contracts) {
    if (c.schools.length) {
      for (const school of c.schools) {
        const connection = await calculateSchoolsMeasure(
          schoolsMeasures[c.name][school.name],
          c.expectedMetrics
        )
        schools.push({
          id: school.id,
          name: school.name,
          budget: school.$extras.pivot_budget,
          externalId: school.externalId,
          locations: concatLocations([
            school?.location1,
            school?.location2,
            school?.location3,
            school?.location4
          ]),
          connection
        })
      }
    }
  }
  return schools
}

const getContractDTO = async (contract: Contract): Promise<ContractDTO> => {
  return {
    id: contract.id,
    name: contract.name,
    isp: contract.isp.name,
    frequency: contract.frequency,
    automatic: contract.automatic,
    signedWithWallet: contract.signedWithWallet,
    signedWalletAddress: contract.signedWalletAddress,
    lta: {
      id: contract?.lta?.id,
      name: contract?.lta?.name
    },
    attachments: contract?.attachments,
    ispContacts: contract?.ispContacts.map((ispContact) => ({
      id: ispContact.id,
      name: ispContact.name,
      email: ispContact.email,
      lastName: ispContact.lastName,
      role: {
        code: ispContact.roles[0]?.code,
        name: ispContact.roles[0]?.name
      }
    })),
    stakeholders: contract?.stakeholders.map((stakeHolder) => ({
      id: stakeHolder.id,
      name: stakeHolder.name,
      email: stakeHolder.email,
      lastName: stakeHolder.lastName,
      role: {
        code: stakeHolder.roles[0]?.code,
        name: stakeHolder.roles[0]?.name
      }
    })),
    startDate: contract.startDate,
    endDate: contract.endDate,
    launchDate: contract.launchDate,
    status: ContractStatus[contract.status],
    country: contract.country
      ? {
          name: contract.country.name,
          flagUrl: contract.country.flagUrl,
          code: contract.country.code
        }
      : undefined,
    expectedMetrics: await Promise.all(
      contract.expectedMetrics.map(async (em) => {
        await em.load('metric')
        return {
          metricId: em.metric.id,
          metricName: em.metric.name,
          metricUnit: em.metric.unit,
          value: em.value
        }
      })
    ),
    budget: contract.budget,
    currency: {
      id: contract.currency.id.toString(),
      name: contract.currency.name,
      code: contract.currency.code,
      type: CurrencyType[contract.currency.type]
    },
    schools: contract?.schools.map((school) => ({
      id: school.id.toString(),
      externalId: school.externalId,
      name: school.name,
      locations: concatLocations([
        school?.location1,
        school?.location2,
        school?.location3,
        school?.location4
      ]),
      educationLevel: school.educationLevel,
      geopoint: school.geopoint,
      email: school.email,
      phoneNumber: school.phoneNumber,
      contactPerson: school.contactPerson,
      gigaIdSchool: school.gigaIdSchool,
      budget: school?.$extras.pivot_budget || 0,
      reliableMeasures: school?.reliableMeasures
    })),
    notes: contract.notes,
    breakingRules: contract.breakingRules,
    cashback: contract.cashback,
    paymentReceiver: {
      id: contract.paymentReceiver?.id,
      name: contract.paymentReceiver?.name,
      lastName: contract.paymentReceiver?.lastName,
      email: contract.paymentReceiver?.email
    }
  }
}

const contractDeatilsDTO = async (
  contract: Contract,
  schoolsMeasures: {},
  connectionsMedian: ConnectionMedian[]
): Promise<ContractDetails> => {
  const schoolsConnection: SchoolsConnection = {
    withoutConnection: 0,
    atLeastOneBellowAvg: 0,
    allEqualOrAboveAvg: 0
  }

  if (contract.schools.length) {
    contract.schools.forEach((school) => {
      evaluateAvgMeasures(
        schoolsMeasures[contract.name][school.name],
        contract.expectedMetrics,
        schoolsConnection
      )
    })
  }

  return {
    id: contract.id,
    name: contract.name,
    isp: contract.isp.name,
    frequency: contract.frequency,
    automatic: contract.automatic,
    signedWithWallet: contract.signedWithWallet,
    signedWalletAddress: contract.signedWalletAddress,
    lta: {
      id: contract?.lta?.id,
      name: contract?.lta?.name
    },
    attachments: contract?.attachments,
    ispContacts: contract?.ispContacts.map((ispContact) => ({
      id: ispContact.id,
      name: ispContact.name,
      email: ispContact.email,
      lastName: ispContact.lastName,
      role: {
        code: ispContact.roles[0]?.code,
        name: ispContact.roles[0]?.name
      }
    })),
    stakeholders: contract?.stakeholders.map((stakeHolder) => ({
      id: stakeHolder.id,
      name: stakeHolder.name,
      email: stakeHolder.email,
      lastName: stakeHolder.lastName,
      role: {
        code: stakeHolder.roles[0]?.code,
        name: stakeHolder.roles[0]?.name
      }
    })),
    startDate: contract.startDate,
    endDate: contract.endDate,
    launchDate: contract.launchDate,
    status: ContractStatus[contract.status],
    country: contract.country
      ? {
          name: contract.country.name,
          flagUrl: contract.country.flagUrl,
          code: contract.country.code
        }
      : undefined,
    expectedMetrics: await Promise.all(
      contract.expectedMetrics.map(async (em) => {
        await em.load('metric')
        return {
          metricId: em.metric.id,
          metricName: em.metric.name,
          metricUnit: em.metric.unit,
          value: em.value
        }
      })
    ),
    schools: await Promise.all(
      contract.schools.map(async (school) => {
        return {
          schooldId: school.id,
          budget: school.$extras.pivot_budget
        }
      })
    ),
    numberOfSchools: contract.$extras.schools_count,
    schoolsConnection: {
      withoutConnection: utils.getPercentage(
        contract.$extras.schools_count,
        schoolsConnection.withoutConnection
      ),
      atLeastOneBellowAvg: utils.getPercentage(
        contract.$extras.schools_count,
        schoolsConnection.atLeastOneBellowAvg
      ),
      allEqualOrAboveAvg: utils.getPercentage(
        contract.$extras.schools_count,
        schoolsConnection.allEqualOrAboveAvg
      )
    },
    notes: contract.notes,
    breakingRules: contract.breakingRules,
    cashback: contract.cashback,
    connectionsMedian,
    budget: contract.budget,
    numberOfPayments: contract.$extras.payments_count,
    currency: {
      id: contract.currency.id.toString(),
      name: contract.currency.name,
      code: contract.currency.code,
      type: CurrencyType[contract.currency.type]
    },
    totalSpent: {
      amount: contract.$extras.total_payments,
      percentage: Math.round(utils.getPercentage(contract.budget, contract.$extras.total_payments))
    },
    paymentReceiver: {
      id: contract.paymentReceiver?.id,
      name: contract.paymentReceiver?.name,
      lastName: contract.paymentReceiver?.lastName,
      email: contract.paymentReceiver?.email
    }
  }
}

const contractCountByStatusDTO = (
  contracts: Contract[],
  totalCount: string,
  draftsCount: string
): ContractsStatusCount => {
  const counts = Object.values(ContractStatus)
    .map((value) => {
      if (typeof value === 'string') {
        return {
          status: value,
          count: 0
        }
      }
    })
    .filter((value) => value) as StatusCount[]

  for (const contract of contracts) {
    counts[contract.$attributes.status] = {
      status: ContractStatus[contract.$attributes.status],
      count: contract.$extras.count
    }
  }

  counts[0] = {
    status: ContractStatus[0],
    count: draftsCount
  }

  return {
    counts,
    totalCount: parseInt(totalCount) + parseInt(draftsCount)
  }
}

const contractListDTO = (
  data: Contract[],
  drafts: Draft[],
  // ltasData: Lta[],
  schoolsMeasures: {}
): ContractListDTO => {
  // const ltas: LtaList = formatLtaList(ltasData)
  const contracts: ContractList[] = []

  drafts.map((draft) => {
    const draftData = {
      id: draft.id,
      listId: v1(),
      name: draft.name,
      isp: draft.isp?.name,
      frequency: draft.frequency,
      start_date: draft.startDate || undefined,
      end_date: draft.endDate || undefined,
      automatic: draft.automatic,
      currencyCode: draft.currency?.code,
      status: 'Draft',
      country: draft.country
        ? {
            name: draft.country.name,
            flagUrl: draft.country.flagUrl,
            code: draft.country.code
          }
        : undefined,
      numberOfSchools: draft.schools?.schools.length,
      budget: draft.budget || 0,
      lta: {
        id: draft.lta?.id || 0,
        name: draft.lta?.name || ''
      },
      notes: draft.notes || '',
      breakingRules: draft.breakingRules || '',
      cashback: 0
    }

    contracts.push(draftData)
  })

  data.map((contract) => {
    const schoolsConnection: SchoolsConnection = {
      withoutConnection: 0,
      atLeastOneBellowAvg: 0,
      allEqualOrAboveAvg: 0
    }

    if (contract.schools.length) {
      contract.schools.map((school) => {
        evaluateAvgMeasures(
          schoolsMeasures[contract.name][school.name],
          contract.expectedMetrics,
          schoolsConnection
        )
      })
    }

    const contractData = {
      id: contract.id,
      listId: v1(),
      name: contract.name,
      isp: contract.isp.name,
      frequency: contract.frequency,
      start_date: contract.startDate,
      end_date: contract.endDate,
      automatic: contract.automatic,
      signedWithWallet: contract.signedWithWallet,
      signedWalletAddress: contract.signedWalletAddress,
      currencyCode: contract.currency.code,
      status: ContractStatus[contract.status],
      country: {
        name: contract.country.name,
        flagUrl: contract.country.flagUrl,
        code: contract.country.code
      },
      schoolsConnection: {
        withoutConnection: utils.getPercentage(
          contract.$extras.schools_count,
          schoolsConnection.withoutConnection
        ),
        atLeastOneBellowAvg: utils.getPercentage(
          contract.$extras.schools_count,
          schoolsConnection.atLeastOneBellowAvg
        ),
        allEqualOrAboveAvg: utils.getPercentage(
          contract.$extras.schools_count,
          schoolsConnection.allEqualOrAboveAvg
        )
      },
      budget: contract.budget,
      numberOfSchools: contract.$extras.schools_count,
      totalSpent: utils.getPercentage(contract.budget, contract.$extras.total_payments),
      lta: {
        id: contract?.lta?.id,
        name: contract?.lta?.name
      },
      notes: contract.notes,
      breakingRules: contract.breakingRules,
      cashback: contract.cashback
    }
    contracts.push(contractData)
  })

  return {
    contracts
  }
}

const evaluateAvgMeasures = (
  schoolMeasures: any[],
  expectedMetrics: ExpectedMetric[],
  schoolsConnection: SchoolsConnection
) => {
  if (!schoolMeasures.length) return (schoolsConnection.withoutConnection += 1)
  for (const em of expectedMetrics) {
    const index = schoolMeasures.findIndex(
      (sm) => sm.metricId.toString() === em.metricId.toString()
    )
    if (!schoolMeasures[index] || schoolMeasures[index]?.$extras.avg < em.value) {
      return (schoolsConnection.atLeastOneBellowAvg += 1)
    }
  }
  return (schoolsConnection.allEqualOrAboveAvg += 1)
}

const calculateSchoolsMeasure = async (
  schoolMeasures: any[],
  expectedMetrics: ExpectedMetric[]
) => {
  const connection: ConnectionEquation = {
    'value': 0,
    'Download speed': 0,
    'Upload speed': 0,
    'Uptime': 0,
    'Latency': 0
  }
  if (!schoolMeasures.length) {
    return Object.keys(connection).reduce((acc, key) => {
      return { ...acc, [key]: -1 }
    }, connection)
  }
  for (const em of expectedMetrics) {
    const index = schoolMeasures.findIndex(
      (sm) => sm.metricId.toString() === em.metricId.toString()
    )
    await em.load('metric')
    const measure = schoolMeasures[index]?.$extras.avg || 0
    connection[em.metric.name] = parseInt(measure)
    const result = utils.getPercentage(em.value, measure)
    connection.value += (em.metric.weight * result) / 100
  }
  return connection
}

const concatLocations = (locations: string[]) => locations.filter((l) => l).join(',')

const contractAvailablePaymentsDTO = (
  paymentsDates: { dates: string; budget_per_element: number }[]
) => {
  const periods = paymentsDates.map(({ dates }) => {
    if (dates.split('-').length > 2) {
      const [day, month, year] = dates.split('-')
      return {
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year)
      }
    } else {
      const [month, year] = dates.split('-')
      return {
        month: parseInt(month),
        year: parseInt(year)
      }
    }
  })

  return {
    amount: Number(paymentsDates[0].budget_per_element.toFixed(4)) || 0,
    periods: periods
  }
}

export default {
  contractCountByStatusDTO,
  contractListDTO,
  contractDeatilsDTO,
  contractSchoolsDetailDTO,
  contractSchoolsDetailsDTO,
  getContractDTO,
  contractAvailablePaymentsDTO,
  calculateSchoolsMeasure
}
