import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/School'

export default class SchoolsController {
  public async listSchoolByCountry({ response, request }: HttpContextContract) {
    const { country_id } = request.params()
    const schools = await service.listSchoolByCountry(country_id)
    return response.ok(schools)
  }
}
