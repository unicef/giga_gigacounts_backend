import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GenerateSignContractRandomStringValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    contract_id: schema.string({}, [rules.exists({ table: 'contracts', column: 'id' })])
  })

  public messages: CustomMessages = {
    'contractId.exists': 'The contract id does not exist'
  }
}
