import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SchoolMeasuresAllValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    interval: schema.enum(['day', 'week', 'month'] as const)
  })

  public messages: CustomMessages = {}
}
