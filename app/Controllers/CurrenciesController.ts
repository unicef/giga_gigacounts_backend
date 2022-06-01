import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Currency'

export default class CurrenciesController {
  public async listCurrencies({ response }: HttpContextContract) {
    const currencies = await service.listCurrencies()
    return response.ok(currencies)
  }
}
