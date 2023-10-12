import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/SchoolService'

export default class SchoolsController {
  public async listSchoolsPagination({ response, request, auth }: HttpContextContract) {
    if (!auth.user) return
    const { countryId, page, limit } = request.qs()
    const schools = await service.listSchoolsPagination(auth.user, page, limit, countryId)
    return response.ok(schools)
  }

  public async searchSchoolsByExternalId({ response, request, auth }: HttpContextContract) {
    if (!auth.user) return

    const { countryId, externalIds } = request.all()
    const schools = await service.searchSchoolsByExternalId(auth.user, externalIds, countryId)

    return response.ok(schools)
  }

  public async searchSchools({ response, request, auth }: HttpContextContract) {
    if (!auth.user) return

    const { countryId, toSearch } = request.qs()

    const schools = await service.searchSchools(auth.user, toSearch, countryId)

    return response.ok(schools)
  }

  public async getSchoolsMeasures({ response, request }: HttpContextContract) {
    try {
      const { schoolId, interval, dateFrom, dateTo } = request.all()
      const schools = await service.getSchoolsMeasures(schoolId, interval, dateFrom, dateTo)
      return response.ok(schools)
    } catch (error) {
      if (!error.status) return response.internalServerError(error.message)
      return response.status(error.status).send(error.message)
    }
  }

  public async updateSchoolReliableMeasures({ response, request, auth }: HttpContextContract) {
    if (!auth.user) return

    try {
      const { schoolId, reliableMeasures } = request.all()
      const affectedSchools = await service.updateSchoolReliableMeasures(schoolId, reliableMeasures)
      return response.ok({ affectedSchools })
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
