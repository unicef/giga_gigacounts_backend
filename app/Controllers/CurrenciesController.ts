import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Currency'

export default class CurrenciesController {
  public async listCurrencies({ response, request }: HttpContextContract) {
    const { type } = request.qs()
    const currencies = await service.listCurrencies(type)
    return response.ok(currencies)
  }
}
