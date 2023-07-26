import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateFeedbackValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    rate: schema.number(),
    comment: schema.string.optional()
  })

  public messages: CustomMessages = {}
}
