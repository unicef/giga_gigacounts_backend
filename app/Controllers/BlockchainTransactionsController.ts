import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import service, { BlockchainTransactionCreation } from 'App/Services/BlockchainTransactions'

export default class BlockchainTransactionsController {
  public async listBlockchainTransactions({ response, request, auth }: HttpContextContract) {
    if (!auth.user) return
    const { contractId, walletAddress } = request.qs()
    const result = await service.listBlockchainTransactions(walletAddress, contractId)
    return response.ok(result)
  }

  public async createBlockchainTransaction({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const data = request.all() as BlockchainTransactionCreation
      const result = await service.createBlockchainTransaction(data, auth.user)
      return response.ok(result)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
