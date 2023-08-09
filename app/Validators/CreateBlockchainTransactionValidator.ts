import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateBlockchainTransactionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    userId: schema.number(),
    contractId: schema.number.nullableAndOptional(),
    walletAddress: schema.string(),
    networkId: schema.number(),
    networkName: schema.string(),
    transactionType: schema.string(),
    transactionHash: schema.string(),
    status: schema.number()
  })
}
