import Contract from 'App/Models/Contract'

import { ContractStatus } from 'App/Helpers/constants'

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

export default {
  contractCountByStatusDTO,
}
