import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateDraftValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number(),
    name: schema.string.optional(),
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
    attachments: schema.object.optional().members({
      attachments: schema.array().members(schema.object().members({ id: schema.number() })),
    }),
    schools: schema.object.optional().members({
      schools: schema.array().members(schema.object().members({ id: schema.number() })),
    }),
    expectedMetrics: schema.object.optional().members({
      metrics: schema
        .array()
        .members(schema.object().members({ metricId: schema.number(), value: schema.number() })),
    }),
  })

  public messages: CustomMessages = {}
}
