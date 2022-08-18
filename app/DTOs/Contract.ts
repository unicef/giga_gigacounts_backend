import Contract from 'App/Models/Contract'
import Draft from 'App/Models/Draft'
import ExpectedMetric from 'App/Models/ExpectedMetric'
import Lta from 'App/Models/Lta'

import { ContractStatus } from 'App/Helpers/constants'
import utils from 'App/Helpers/utils'
import { DateTime } from 'luxon'
import { v1 } from 'uuid'
import Currency from 'App/Models/Currency'

interface StatusCount {
  status: string
  count: any
}

export interface ContractsStatusCount {
  counts: StatusCount[]
  totalCount: number
}

export interface ContractListDTO {
  ltas: LtaList
  contracts: ContractList[]
}

interface LtaList {
  [name: string]: ContractList[]
}

interface ContractList {
  id: number
  listId: string
  name: string
  isp?: string
  status: string
  country?: {
    name: string
    code: string
    flagUrl: string
  }
  schoolsConnection?: SchoolsConnection
  numberOfSchools?: number
  totalSpent?: number
  ltaId?: number
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
  lta?: string
  startDate: DateTime
  endDate: DateTime
  schoolsConnection?: SchoolsConnection
  numberOfSchools?: number
  attachments?: {
    id: number
    url: string
    ipfs_url?: string
    name: string
  }[]
  connectionsMedian: ConnectionMedian[]
  budget: string
  numberOfPayments: number
  currency: Currency
  totalSpent: {
    amount: string
    percentage: number
  }
}

interface ConnectionEquation {
  'value': number
  'Uptime': number
  'Latency': number
  'Download speed': number
  'Upload speed': number
}

export interface ContractSchoolsDetail {
  id: number
  name: string
  externalId: string
  locations: string
  connection: ConnectionEquation
}

export interface ContractDTO {
  id: number
  name: string
  isp: string
  lta?: string
  attachments?: {
    id: number
    url: string
    ipfs_url?: string
    name: string
  }[]
  startDate: DateTime
  endDate: DateTime
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
  budget: string
  currency: {
    id: string
    name: string
    code: string
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
  }[]
}

const contractSchoolsDetailDTO = async (contract: Contract, schoolsMeasures: {}) => {
  const schools: ContractSchoolsDetail[] = []
  if (contract.schools.length) {
    for (const school of contract.schools) {
      const connection = await calculateSchoolsMeasure(
        schoolsMeasures[contract.name][school.name],
        contract.expectedMetrics
      )
      schools.push({
        id: school.id,
        name: school.name,
        externalId: school.externalId,
        locations: concatLocations([
          school?.location1,
          school?.location2,
          school?.location3,
          school?.location4,
        ]),
        connection,
      })
    }
  }
  return schools
}

const getContractDTO = async (contract: Contract): Promise<ContractDTO> => {
  return {
    id: contract.id,
    name: contract.name,
    isp: contract.isp.name,
    lta: contract?.lta?.name,
    attachments: contract?.attachments,
    startDate: contract.startDate,
    endDate: contract.endDate,
    status: ContractStatus[contract.status],
    country: contract.country
      ? {
          name: contract.country.name,
          flagUrl: contract.country.flagUrl,
          code: contract.country.code,
        }
      : undefined,
    expectedMetrics: await Promise.all(
      contract.expectedMetrics.map(async (em) => {
        await em.load('metric')
        return {
          metricId: em.metric.id,
          metricName: em.metric.name,
          metricUnit: em.metric.unit,
          value: em.value,
        }
      })
    ),
    budget: contract.budget,
    currency: {
      id: contract.currency.id.toString(),
      name: contract.currency.name,
      code: contract.currency.code,
    },
    schools: contract?.schools.map((school) => ({
      id: school.id.toString(),
      externalId: school.externalId,
      name: school.name,
      locations: concatLocations([
        school?.location1,
        school?.location2,
        school?.location3,
        school?.location4,
      ]),
      educationLevel: school.educationLevel,
      geopoint: school.geopoint,
      email: school.email,
      phoneNumber: school.phoneNumber,
      contactPerson: school.contactPerson,
      gigaIdSchool: school.gigaIdSchool,
    })),
  }
}

const contractDeatilsDTO = (
  contract: Contract,
  schoolsMeasures: {},
  connectionsMedian: ConnectionMedian[]
): ContractDetails => {
  const schoolsConnection: SchoolsConnection = {
    withoutConnection: 0,
    atLeastOneBellowAvg: 0,
    allEqualOrAboveAvg: 0,
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
    lta: contract?.lta?.name,
    attachments: contract?.attachments,
    startDate: contract.startDate,
    endDate: contract.endDate,
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
      ),
    },
    connectionsMedian,
    budget: contract.budget,
    numberOfPayments: contract.$extras.payments_count,
    currency: contract.currency,
    totalSpent: {
      amount: contract.$extras.total_payments,
      percentage: utils.getPercentage(parseInt(contract.budget), contract.$extras.total_payments),
    },
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
          count: 0,
        }
      }
    })
    .filter((value) => value) as StatusCount[]

  for (const contract of contracts) {
    counts[contract.$attributes.status] = {
      status: ContractStatus[contract.$attributes.status],
      count: contract.$extras.count,
    }
  }

  counts[0] = {
    status: ContractStatus[0],
    count: draftsCount,
  }

  return {
    counts,
    totalCount: parseInt(totalCount) + parseInt(draftsCount),
  }
}

const contractListDTO = (
  data: Contract[],
  drafts: Draft[],
  ltasData: Lta[],
  schoolsMeasures: {}
): ContractListDTO => {
  const ltas: LtaList = formatLtaList(ltasData)
  const contracts: ContractList[] = []

  drafts.map((draft) => {
    const draftData = {
      id: draft.id,
      listId: v1(),
      name: draft.name,
      isp: draft.isp?.name,
      status: 'Draft',
      country: draft.country
        ? {
            name: draft.country.name,
            flagUrl: draft.country.flagUrl,
            code: draft.country.code,
          }
        : undefined,
      numberOfSchools: draft.schools?.schools.length,
      ltaId: draft.ltaId,
    }

    if (draft.ltaId) {
      if (ltas[draft.lta.name]) {
        ltas[draft.lta.name].push(draftData)
      }
    } else {
      contracts.push(draftData)
    }
  })

  data.map((contract) => {
    const schoolsConnection: SchoolsConnection = {
      withoutConnection: 0,
      atLeastOneBellowAvg: 0,
      allEqualOrAboveAvg: 0,
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
      status: ContractStatus[contract.status],
      country: {
        name: contract.country.name,
        flagUrl: contract.country.flagUrl,
        code: contract.country.code,
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
        ),
      },
      numberOfSchools: contract.$extras.schools_count,
      totalSpent: utils.getPercentage(parseInt(contract.budget), contract.$extras.total_payments),
      ltaId: contract.ltaId,
    }

    if (contract.ltaId) {
      if (ltas[contract.lta.name]) {
        ltas[contract.lta.name].push(contractData)
      }
    } else {
      contracts.push(contractData)
    }
  })

  return {
    ltas,
    contracts,
  }
}

const formatLtaList = (ltas: Lta[]) => {
  return ltas.reduce(
    (aggregate, current) => ({
      ...aggregate,
      [current.name]: [],
    }),
    {}
  )
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
    'Latency': 0,
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

export default {
  contractCountByStatusDTO,
  contractListDTO,
  contractDeatilsDTO,
  contractSchoolsDetailDTO,
  getContractDTO,
}
