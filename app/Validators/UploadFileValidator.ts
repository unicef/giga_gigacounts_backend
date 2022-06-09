import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UploadFileValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    file: schema.string(),
  })

  public messages: CustomMessages = {}
}
