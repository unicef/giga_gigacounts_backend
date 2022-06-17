import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Attachment'

export default class AttachmentsController {
  public async upload({ response, request }: HttpContextContract) {
    try {
      const { file } = request.all()
      const attachment = await service.uploadAttachment(file)
      return response.ok(attachment)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
