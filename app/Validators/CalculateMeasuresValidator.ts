import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CalculateMeasuresValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    contractId: schema.string(),
    year: schema.number(),
    month: schema.number(),
  })

  public messages: CustomMessages = {}
}
