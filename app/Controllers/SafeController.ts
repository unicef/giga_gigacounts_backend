import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Safe'

export default class SafeController {
  public async createSafe({ response, request }: HttpContextContract) {
    try {
      const { name } = request.all()
      const safe = await service.createSafe(name)
      return response.ok(safe)
    } catch (error) {
      return response.status(424).send(error.message)
    }
  }
}
