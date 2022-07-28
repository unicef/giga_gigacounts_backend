import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateDraftValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.request.body().id,
  })

  public schema = schema.create({
    id: schema.number(),
    name: schema.string.optional({}, [
      rules.unique({ table: 'contracts', column: 'name', caseInsensitive: true }),
      rules.unique({
        table: 'drafts',
        column: 'name',
        caseInsensitive: true,
        whereNot: { id: this.refs.id },
      }),
    ]),
    countryId: schema.number.nullableAndOptional(),
    governmentBehalf: schema.boolean.nullableAndOptional(),
    ltaId: schema.number.nullableAndOptional(),
    currencyId: schema.number.nullableAndOptional(),
    budget: schema.string.nullableAndOptional(),
    frequencyId: schema.number.nullableAndOptional(),
    startDate: schema.date.nullableAndOptional({
      format: 'yyyy-MM-dd',
    }),
    endDate: schema.date.nullableAndOptional(
      {
        format: 'yyyy-MM-dd',
      },
      [rules.afterOrEqualToField('startDate')]
    ),
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

  public messages: CustomMessages = {}
}
