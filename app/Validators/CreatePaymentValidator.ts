import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreatePaymentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    month: schema.number(),
    year: schema.number(),
    contractId: schema.string(),
    description: schema.string.nullableAndOptional(),
    amount: schema.number(),
    invoice: schema.object.nullableAndOptional().members({
      file: schema.string(),
      name: schema.string()
    }),
    receipt: schema.object.nullableAndOptional().members({
      file: schema.string(),
      name: schema.string()
    })
  })

  public messages: CustomMessages = {}
}
