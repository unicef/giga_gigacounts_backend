import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import service from 'App/Services/Dashboard'

export default class DashboardController {
  public async listDashboardSchools({ response, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const schools = await service.listDashboardSchools(auth.user)
      return response.ok(schools)
      } catch (error) {
      if (!error.status) return response.internalServerError(error.message)
      return response.status(error.status).send(error.message)
    }
  }
}

