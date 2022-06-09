import Contract from 'App/Models/Contract'

import { ContractStatus } from 'App/Helpers/constants'
import Payment from 'App/Models/Payment'
import School from 'App/Models/School'
import ExpectedMetric from 'App/Models/ExpectedMetric'

export interface ContractsStatusCount {
  counts: {
    status: string
    count: any
  }[]
  totalCount: number
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

const contractListDTO = (data: Contract[]) => {
  const ltas = {}
  const contracts: Contract[] = []
  data.map((c) => {
    if (c.ltaId) {
      if (ltas[c.lta.name]) {
        ltas[c.lta.name] = ltas[c.lta.name].push(c)
      } else {
        ltas[c.lta.name] = [c]
      }
    } else {
      contracts.push(c)
    }
  })
  console.log(ltas)
}

const calculateMetrics = (schools: School[], expectedMetrics: ExpectedMetric) => {}

export default {
  contractCountByStatusDTO,
  contractListDTO,
}
