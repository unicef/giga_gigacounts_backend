import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import service from 'App/Services/Dashboard'

export default class DashboardController {
  public async listDashboardSchools({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return

      const { countryId } = request.qs()
      const schools = await service.listDashboardSchools(auth.user, countryId)
      return response.ok(schools)
    } catch (error) {
      if (!error.status) return response.internalServerError(error.message)
      return response.status(error.status).send(error.message)
    }
  }

  public async listNotMeetsSla({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return

      const { countryId } = request.qs()
      const resp = await service.listNotMeetsSla(auth.user, countryId)
      return response.ok(resp)
    } catch (error) {
      if (!error.status) return response.internalServerError(error.message)
      return response.status(error.status).send(error.message)
    }
  }
}
