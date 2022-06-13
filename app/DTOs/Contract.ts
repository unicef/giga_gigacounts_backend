import Contract from 'App/Models/Contract'
import Draft from 'App/Models/Draft'
import ExpectedMetric from 'App/Models/ExpectedMetric'

import { ContractStatus } from 'App/Helpers/constants'
import Lta from 'App/Models/Lta'

export interface ContractsStatusCount {
  counts: {
    status: string
    count: any
  }[]
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
  budget?: {
    budget: string
    totalSpend: string
  }
  ltaId?: number
}

interface SchoolsConnection {
  withoutConnection: number
  atLeastOneBellowAvg: number
  allEqualOrHigherAvg: number
}

const contractCountByStatusDTO = (
  contracts: Contract[],
  totalCount: string,
  draftsCount: string
): ContractsStatusCount => {
  const counts = contracts.map((c) => ({
    status: ContractStatus[c.$attributes.status],
    count: c.$extras.count,
  }))
  counts[counts.length] = {
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

  drafts.map((d) => {
    const draft = {
      id: d.id,
      name: d.name,
      isp: d.isp?.name,
      status: 'Draft',
      country: d.country
        ? {
            name: d.country.name,
            flagUrl: d.country.flagUrl,
            code: d.country.code,
          }
        : undefined,
      numberOfSchools: d.schools?.schools.length,
      ltaId: d.ltaId,
    }

    if (d.ltaId) {
      if (ltas[d.lta.name]) {
        ltas[d.lta.name].push(draft)
      }
    } else {
      contracts.push(draft)
    }
  })

  data.map((c) => {
    const schoolsConnection: SchoolsConnection = {
      withoutConnection: 0,
      atLeastOneBellowAvg: 0,
      allEqualOrHigherAvg: 0,
    }

    if (c.schools.length) {
      c.schools.map((s) => {
        evaluateMeasures(schoolsMeasures[s.name], c.expectedMetrics, schoolsConnection)
      })
    }

    const contract = {
      id: c.id,
      name: c.name,
      isp: c.isp.name,
      status: ContractStatus[c.status],
      country: {
        name: c.country.name,
        flagUrl: c.country.flagUrl,
        code: c.country.code,
      },
      schoolsConnection,
      numberOfSchools: c.$extras.schools_count,
      budget: {
        budget: c.budget,
        totalSpend: c.$extras.total_payments,
      },
      ltaId: c.ltaId,
    }

    if (c.ltaId) {
      if (ltas[c.lta.name]) {
        ltas[c.lta.name].push(contract)
      }
    } else {
      contracts.push(contract)
    }
  })

  return {
    ltas,
    contracts,
  }
}

const formatLtaList = (ltas: Lta[]) => {
  const ltasObj = {}
  ltas.map((l) => (ltasObj[l.name] = []))
  return ltasObj
}

const evaluateMeasures = (
  schoolMeasures: any[],
  expectedMetrics: ExpectedMetric[],
  schoolsConnection: SchoolsConnection
) => {
  if (!schoolMeasures.length) return (schoolsConnection.withoutConnection += 1)
  for (const em of expectedMetrics) {
    const index = schoolMeasures.findIndex(
      (sm) => sm.metricId.toString() === em.metricId.toString()
    )
    if (schoolMeasures[index].$extras.avg < em.value) {
      return (schoolsConnection.atLeastOneBellowAvg += 1)
    }
  }
  return (schoolsConnection.allEqualOrHigherAvg += 1)
}

export default {
  contractCountByStatusDTO,
  contractListDTO,
}
