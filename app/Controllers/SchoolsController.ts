import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/School'

export default class SchoolsController {
  public async listSchoolByCountry({ response, request, auth }: HttpContextContract) {
    if (!auth.user) return
    const { countryId } = request.qs()
    const schools = await service.listSchoolByCountry(auth.user, countryId)
    return response.ok(schools)
  }

  public async getSchoolsMeasures({ response, request }: HttpContextContract) {
    try {
      const { schoolId, contractId, interval } = request.all()
      const schools = await service.getSchoolsMeasures(schoolId, contractId, interval)
      return response.ok(schools)
    } catch (error) {
      if (!error.status) return response.internalServerError(error.message)
      return response.status(error.status).send(error.message)
    }
  }
}
