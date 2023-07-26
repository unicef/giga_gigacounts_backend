import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SignContractWithWalletValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    contract_id: schema.string({}, [rules.exists({ table: 'contracts', column: 'id' })]),
    address: schema.string(),
    signatureHash: schema.string()
  })

  public messages: CustomMessages = {
    'contractId.exists': 'The contract id does not exist'
  }
}
