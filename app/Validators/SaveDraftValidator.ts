import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SaveDraftValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [
      rules.unique({ table: 'contracts', column: 'name', caseInsensitive: true }),
      rules.unique({ table: 'drafts', column: 'name', caseInsensitive: true }),
    ]),
    countryId: schema.number.nullableAndOptional(),
    governmentBehalf: schema.boolean.nullableAndOptional(),
    ltaId: schema.number.nullableAndOptional(),
    currencyId: schema.number.nullableAndOptional(),
    budget: schema.string.nullableAndOptional(),
    frequencyId: schema.number.nullableAndOptional(),
    startDate: schema.date.nullableAndOptional(),
    endDate: schema.date.nullableAndOptional(),
    ispId: schema.number.nullableAndOptional(),
    createdBy: schema.number.nullableAndOptional(),
    schools: schema.object.optional().members({
      schools: schema.array().members(schema.object().members({ id: schema.number() })),
    }),
    expectedMetrics: schema.object.optional().members({
      metrics: schema
        .array()
        .members(schema.object().members({ metricId: schema.number(), value: schema.number() })),
    }),
  })

  public messages: CustomMessages = {
    'name.unique':
      'The contract name you have selected is already taken. Please choose a different one',
  }
}
