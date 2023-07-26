import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SchoolMeasuresValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    schoolId: schema.string(),
    contractId: schema.string(),
    interval: schema.enum(['day', 'week', 'month'] as const)
  })

  public messages: CustomMessages = {}
}
