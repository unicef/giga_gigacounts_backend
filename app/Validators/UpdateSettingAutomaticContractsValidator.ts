import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class updateSettingAutomaticContractsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    automaticContractsEnabled: schema.boolean()
  })

  public messages: CustomMessages = {}
}
