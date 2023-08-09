import { DateTime } from 'luxon'
import BlockchainTransaction from 'App/Models/BlockchainTransaction'

export interface GetBlockchainTransaction {
  id: number
  userId: number
  userDisplayName: string
  userEmail: string
  contractId?: number
  contractName: string
  walletAddress: string
  networkId: number
  networkName: string
  transactionType: string
  transactionHash: string
  status: number
  createdAt: DateTime
}

const getBlockchainTransactionDTO = (
  blockchainTransaction: BlockchainTransaction
): GetBlockchainTransaction => ({
  id: blockchainTransaction.id,
  userId: blockchainTransaction.userId,
  userDisplayName: `${blockchainTransaction.user.name}, ${blockchainTransaction.user.lastName}`,
  userEmail: blockchainTransaction.user.email,
  contractId: blockchainTransaction.contractId,
  contractName: blockchainTransaction.contract?.name,
  walletAddress: blockchainTransaction.walletAddress,
  networkId: blockchainTransaction.networkId,
  networkName: blockchainTransaction.networkName,
  transactionType: blockchainTransaction.transactionType,
  transactionHash: blockchainTransaction.transactionHash,
  status: blockchainTransaction.status,
  createdAt: blockchainTransaction.createdAt
})

const getBlockchainTransactionsDTO = (
  blockchainTransactions: BlockchainTransaction[]
): GetBlockchainTransaction[] => {
  return blockchainTransactions.map(getBlockchainTransactionDTO)
}

export default {
  getBlockchainTransactionsDTO
}
