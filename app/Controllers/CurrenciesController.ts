import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/CurrencyService'

export default class CurrenciesController {
  public async listCurrencies({ response, request }: HttpContextContract) {
    try {
      const { type, networkId, countryId } = request.qs()
      const currencies = await service.listCurrencies(type, networkId, countryId)
      return response.ok(currencies)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
