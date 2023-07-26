import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateContractValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    draftId: schema.string.nullableAndOptional(),
    name: schema.string({}, [
      rules.unique({ table: 'contracts', column: 'name', caseInsensitive: true })
    ]),
    countryId: schema.string(),
    governmentBehalf: schema.boolean.optional(),
    ltaId: schema.string.nullableAndOptional(),
    currencyId: schema.string(),
    budget: schema.number(),
    startDate: schema.date(),
    endDate: schema.date({}, [rules.afterOrEqualToField('startDate')]),
    launchDate: schema.date(),
    ispId: schema.string(),
    schools: schema.object().members({
      schools: schema.array().members(schema.object().members({ id: schema.string() }))
    }),
    expectedMetrics: schema.object().members({
      metrics: schema
        .array()
        .members(schema.object().members({ metricId: schema.string(), value: schema.number() }))
    })
  })

  public messages: CustomMessages = {
    'name.unique':
      'The contract name you have selected is already taken. Please choose a different one'
  }
}
