import BlockchainTransaction from 'App/Models/BlockchainTransaction'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

import dto, { GetBlockchainTransaction } from 'App/DTOs/BlockchainTransaction'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'
import DatabaseException from 'App/Exceptions/DatabaseException'

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

const listBlockchainTransactionsFundContracts = async (
  contractId: number
): Promise<GetBlockchainTransaction[]> => {
  const { query } = await queryBuilderUser(undefined, contractId)
  const blockchainTransactions: BlockchainTransaction[] = await query
  return dto.getBlockchainTransactionsDTO(blockchainTransactions)
}

const createBlockchainTransaction = async (
  data: BlockchainTransactionCreation
): Promise<BlockchainTransaction> => {
  const trx = await Database.transaction()
  try {
    const entity = await BlockchainTransaction.create(
      {
        userId: data.userId || 0,
        contractId: data.contractId || 0,
        walletAddress: data.walletAddress || '',
        networkId: data.networkId || 0,
        networkName: data.networkName || '',
        transactionType: data.transactionType || '',
        transactionHash: data.transactionHash || '',
        status: data.status
      },
      { client: trx }
    )
    await trx.commit()
    return entity
  } catch (error) {
    console.error(error)
    await trx.rollback()
    if (error.status === 404) throw error
    throw new DatabaseException(
      'Some database error occurred while creating blockchain transaction log'
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
  createBlockchainTransaction,
  listBlockchainTransactionsFundContracts
}
