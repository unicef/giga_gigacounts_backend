import Contract from 'App/Models/Contract'

export interface iDashboardContractListDTO {
  contracts: ContractList[]
}

interface ContractList {
  id: number
  name: string
  isp?: string
  numberOfSchools?: number
  meetsSla?: boolean
  budget?: number
}

export interface ContractDTO {
  id: number
  name: string
  isp: string
  budget: number
}

const dashboardContractListDTO = (data: Contract[]): iDashboardContractListDTO => {
  const contracts: ContractList[] = []

  data.map((contract) => {
    const contractData = {
      id: contract.id,
      name: contract.name,
      isp: contract.isp.name,
      budget: contract.budget,
      numberOfSchools: contract.schools.length
    }
    contracts.push(contractData)
  })

  return {
    contracts
  }
}

export default {
  dashboardContractListDTO
}
