import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Country'

export default class CountriesController {
  public async listCountries({ response }: HttpContextContract) {
    const countries = await service.listCountries()
    return response.ok(countries)
  }
}
