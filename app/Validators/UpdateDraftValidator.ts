import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { requestsFormatDate } from 'App/Helpers/constants'
export default class UpdateDraftValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.request.body().id
  })

  public schema = schema.create({
    id: schema.string(),
    name: schema.string.optional({}, [
      rules.unique({ table: 'contracts', column: 'name', caseInsensitive: true }),
      rules.unique({
        table: 'drafts',
        column: 'name',
        caseInsensitive: true,
        whereNot: { id: this.refs.id }
      })
    ]),
    countryId: schema.string.nullableAndOptional(),
    governmentBehalf: schema.boolean.nullableAndOptional(),
    ltaId: schema.string.nullableAndOptional(),
    currencyId: schema.string.nullableAndOptional(),
    budget: schema.string.nullableAndOptional(),
    frequencyId: schema.string.nullableAndOptional(),
    startDate: schema.date.nullableAndOptional({
      format: requestsFormatDate
    }),
    endDate: schema.date.nullableAndOptional(
      {
        format: requestsFormatDate
      },
      [rules.afterOrEqualToField('startDate')]
    ),
    launchDate: schema.date.nullableAndOptional({
      format: requestsFormatDate
    }),
    ispId: schema.string.nullableAndOptional(),
    createdBy: schema.string.nullableAndOptional(),
    schools: schema.object.optional().members({
      schools: schema.array
        .optional()
        .members(
          schema.object
            .optional()
            .members({ external_id: schema.string(), budget: schema.string.optional() })
        )
    }),
    expectedMetrics: schema.object.optional().members({
      metrics: schema
        .array()
        .members(schema.object().members({ metricId: schema.string(), value: schema.number() }))
    })
  })

  public messages: CustomMessages = {}
}
