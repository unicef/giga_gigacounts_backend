import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdatePaymentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    paymentId: schema.string(),
    month: schema.number.nullableAndOptional([rules.requiredIfExists('year')]),
    year: schema.number.nullableAndOptional([rules.requiredIfExists('month')]),
    description: schema.string.nullableAndOptional(),
    amount: schema.number.nullableAndOptional(),
    invoice: schema.object.nullableAndOptional().members({
      file: schema.string(),
      name: schema.string()
    }),
    receipt: schema.object.nullableAndOptional().members({
      file: schema.string(),
      name: schema.string()
    })
  })

  public messages: CustomMessages = {
    'month.requiredIfExists': 'month and year are required if together',
    'year.requiredIfExists': 'month and year are required if together'
  }
}
