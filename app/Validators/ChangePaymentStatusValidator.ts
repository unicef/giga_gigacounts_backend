import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ChangePaymentStatusValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    paymentId: schema.string(),
    status: schema.number([rules.range(0, 2)]),
  })

  public messages: CustomMessages = {
    'status.range': 'Invalid status, available status are: 0, 1, 2',
  }
}
