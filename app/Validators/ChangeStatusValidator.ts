import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ChangeStatusValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    contract_id: schema.number(),
    status: schema.number(),
  })

  public messages: CustomMessages = {}
}
