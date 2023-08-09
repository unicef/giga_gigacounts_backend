import BlockchainTransaction from 'App/Models/BlockchainTransaction'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

import dto, { GetBlockchainTransaction } from 'App/DTOs/BlockchainTransaction'
import { DateTime } from 'luxon'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import FailedDependencyException from 'App/Exceptions/FailedDependencyException'

export interface BlockchainTransactionCreation {
  id: number
  userId: number
  contractId?: number
  walletAddress: string
  networkId: number
  networkName: string
  transactionType: string
  transactionHash: string
  status: number
  createdAt: DateTime
}

const listBlockchainTransactions = async (
  walletAddress?: string,
  contractId?: number
): Promise<GetBlockchainTransaction[]> => {
  const { query } = await queryBuilderUser(walletAddress, contractId)
  const blockchainTransactions: BlockchainTransaction[] = await query
  return dto.getBlockchainTransactionsDTO(blockchainTransactions)
}

const createBlockchainTransaction = async (
  data: BlockchainTransactionCreation,
  user: User
): Promise<BlockchainTransaction> => {
  const trx = await Database.transaction()
  try {
    const entity = await BlockchainTransaction.create(
      {
        userId: data.userId,
        contractId: data.contractId,
        walletAddress: data.walletAddress,
        networkId: data.networkId,
        networkName: data.networkName,
        transactionType: data.transactionType,
        transactionHash: data.transactionHash,
        status: data.status
      },
      { client: trx }
    )
    await trx.commit()
    return entity
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

const queryBuilderUser = async (
  walletAddress?: string,
  contractId?: number
): Promise<{
  query: ModelQueryBuilderContract<typeof BlockchainTransaction, BlockchainTransaction>
}> => {
  let query = BlockchainTransaction.query()

  if (walletAddress) {
    query.where('walletAddress', walletAddress)
  }
  if (contractId) {
    if (walletAddress) query.andWhere('contractId', contractId)
    else query.where('contractId', contractId)
  }

  query.orderBy('createdAt', 'desc')
  query.preload('user')
  query.preload('contract')

  return { query }
}

export default {
  listBlockchainTransactions,
  createBlockchainTransaction
}
