import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Lta'

export default class LtasController {
  public async listLtas({ response, request }: HttpContextContract) {
    const { countryId } = request.qs()
    const ltas = await service.listLtas(countryId)
    return response.ok(ltas)
  }
}
