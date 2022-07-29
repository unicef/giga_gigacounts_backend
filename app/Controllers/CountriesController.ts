import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Country'

export default class CountriesController {
  public async listCountries({ response, auth }: HttpContextContract) {
    if (!auth.user) return
    const countries = await service.listCountries(auth.user)
    return response.ok(countries)
  }
}
