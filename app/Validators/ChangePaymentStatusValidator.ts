import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ChangePaymentStatusValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    paymentId: schema.string(),
    status: schema.enum(['Draft', 'Unpaid', 'Paid'])
  })

  public messages: CustomMessages = {
    'status.enum': 'Invalid status, available status are: Draft, Unpaid and Paid'
  }
}
