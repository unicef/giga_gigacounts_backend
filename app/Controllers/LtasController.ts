import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Lta'

export default class LtasController {
  public async listLtas({ response, request, auth }: HttpContextContract) {
    if (!auth.user) return
    const { countryId } = request.qs()
    const ltas = await service.listLtas(auth.user, countryId)
    return response.ok(ltas)
  }
}
