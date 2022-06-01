import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App//Services/Contract'

export default class ContractsController {
  public async countByStatus({ response, auth }: HttpContextContract) {
    try {
      const count = await service.getContractsCountByStatus(auth.user)
      return response.ok(count)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
