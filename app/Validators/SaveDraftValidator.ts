import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SaveDraftValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [
      rules.unique({ table: 'contracts', column: 'name', caseInsensitive: true }),
      rules.unique({ table: 'drafts', column: 'name', caseInsensitive: true }),
    ]),
    countryId: schema.string.nullableAndOptional(),
    governmentBehalf: schema.boolean.nullableAndOptional(),
    ltaId: schema.string.nullableAndOptional(),
    currencyId: schema.string.nullableAndOptional(),
    budget: schema.string.nullableAndOptional(),
    frequencyId: schema.string.nullableAndOptional(),
    startDate: schema.date.nullableAndOptional({
      format: 'yyyy-MM-dd',
    }),
    endDate: schema.date.nullableAndOptional(
      {
        format: 'yyyy-MM-dd',
      },
      [rules.afterOrEqualToField('startDate')]
    ),
    ispId: schema.string.nullableAndOptional(),
    createdBy: schema.string.nullableAndOptional(),
    schools: schema.object.optional().members({
      schools: schema.array().members(schema.object().members({ id: schema.string() })),
    }),
    expectedMetrics: schema.object.optional().members({
      metrics: schema
        .array()
        .members(schema.object().members({ metricId: schema.string(), value: schema.number() })),
    }),
  })

  public messages: CustomMessages = {
    'name.unique':
      'The contract name you have selected is already taken. Please choose a different one',
  }
}
