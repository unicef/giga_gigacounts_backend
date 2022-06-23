import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/School'

export default class SchoolsController {
  public async listSchoolByCountry({ response, request }: HttpContextContract) {
    const { countryId } = request.qs()
    const schools = await service.listSchoolByCountry(countryId)
    return response.ok(schools)
  }
}
