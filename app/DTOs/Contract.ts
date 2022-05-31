import Contract from 'App/Models/Contract'

import { ContractStatus } from 'App/Helpers/constants'

export interface ContractsStatusCount {
  counts: {
    status: string
    count: any
  }[]
  totalCount: string
}

const contractCountByStatusDTO = (
  contracts: Contract[],
  totalCount: string
): ContractsStatusCount => {
  const counts = contracts.map((c) => ({
    status: ContractStatus[c.$attributes.status],
    count: c.$extras.count,
  }))
  return {
    counts,
    totalCount,
  }
}

export default {
  contractCountByStatusDTO,
}
