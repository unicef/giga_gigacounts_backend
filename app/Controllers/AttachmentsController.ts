import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service, { UploadRequest } from 'App/Services/AttachmentService'

export default class AttachmentsController {
  public async upload({ response, request }: HttpContextContract) {
    try {
      const data = request.all() as UploadRequest
      const attachment = await service.uploadAttachment(data)
      return response.ok(attachment)
    } catch (error) {
      return response.status(error?.status || error.statusCode).send(error.message)
    }
  }

  public async deleteAttachment({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const { attachmentId } = request.params()
      const result = await service.deleteAttachment(attachmentId, auth.user)
      response.ok(result)
    } catch (error) {
      return response.status(error?.status || error.statusCode).send(error.message)
    }
  }

  public async getAttachment({ response, request }: HttpContextContract) {
    try {
      const { attachment_id } = request.params()
      const attachment = await service.getAttachment(attachment_id)
      response.ok(attachment)
    } catch (error) {
      return response.status(error?.status || error.statusCode).send(error.message)
    }
  }
}
