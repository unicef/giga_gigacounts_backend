import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateContractValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    draftId: schema.number.nullableAndOptional(),
    name: schema.string({}, [
      rules.unique({ table: 'contracts', column: 'name', caseInsensitive: true }),
    ]),
    countryId: schema.number(),
    governmentBehalf: schema.boolean(),
    ltaId: schema.number.nullableAndOptional(),
    currencyId: schema.number(),
    budget: schema.string(),
    frequencyId: schema.number(),
    startDate: schema.date(),
    endDate: schema.date({}, [rules.afterOrEqualToField('startDate')]),
    ispId: schema.number(),
    createdBy: schema.number(),
    attachments: schema.array.optional().members(schema.object().members({ id: schema.string() })),
    schools: schema.object().members({
      schools: schema.array().members(schema.object().members({ id: schema.number() })),
    }),
    expectedMetrics: schema.object().members({
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
