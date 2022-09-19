import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Safe'

export default class SafeController {
  public async createSafe({ response, request }: HttpContextContract) {
    try {
      const { name } = request.all()
      const safe = await service.createSafe(name)
      return response.ok(safe)
    } catch (error) {
      return response.status(422).send(error.message)
    }
  }

  public async addUsersToSafe({ response, request }: HttpContextContract) {
    try {
      const { email } = request.all()
      const result = await service.addUsersToSafe(email)
      return response.ok(result)
    } catch (error) {
      return response.status(422).send(error.message)
    }
  }
}
