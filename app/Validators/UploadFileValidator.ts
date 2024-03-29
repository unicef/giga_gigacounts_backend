import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { AttachmentsType } from 'App/Services/AttachmentService'

export default class UploadFileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.string(),
    name: schema.string(),
    type: schema.enum(Object.values(AttachmentsType)),
    typeId: schema.string()
  })

  public messages: CustomMessages = {}
}
