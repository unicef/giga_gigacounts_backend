import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service, { UploadRequest } from 'App/Services/IspContactService'

export default class IspContactsController {
  public async upload({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return

      const { externalUser } = request.qs()
      const data = request.all() as UploadRequest
      const ispContact = await service.uploadIspContact(data, Boolean(Number(externalUser)))
      return response.ok(ispContact)
    } catch (error) {
      return response.status(error?.status || error.statusCode).send(error.message)
    }
  }

  public async deleteIspContact({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return

      const { externalUser } = request.qs()
      const data = request.all() as UploadRequest
      const result = await service.deleteIspContact(data, Boolean(Number(externalUser)))
      response.ok(result)
    } catch (error) {
      return response.status(error?.status || error.statusCode).send(error.message)
    }
  }
}
