import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service, { UploadRequest } from 'App/Services/Attachment'

export default class AttachmentsController {
  public async upload({ response, request }: HttpContextContract) {
    try {
      const data = request.all() as UploadRequest
      const attachment = await service.uploadAttachment(data)
      return response.ok(attachment)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async deleteAttachment({ response, request }: HttpContextContract) {
    try {
      const { attachment_id } = request.params()
      const result = await service.deleteAttachment(attachment_id)
      response.ok(result)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async getAttachment({ response, request }: HttpContextContract) {
    try {
      const { attachment_id } = request.params()
      const attachment = await service.getAttachment(attachment_id)
      response.ok(attachment)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
