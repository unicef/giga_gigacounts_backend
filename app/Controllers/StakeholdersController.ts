import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service, { UploadRequest } from 'App/Services/StakeholderService'

export default class StakeholdersController {
  public async upload({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const data = request.all() as UploadRequest
      const ispContact = await service.uploadStakeholder(data)
      return response.ok(ispContact)
    } catch (error) {
      return response.status(error?.status || error.statusCode).send(error.message)
    }
  }

  public async deleteStakeholder({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const data = request.all() as UploadRequest
      const result = await service.deleteStakeholder(data)
      response.ok(result)
    } catch (error) {
      return response.status(error?.status || error.statusCode).send(error.message)
    }
  }
}
