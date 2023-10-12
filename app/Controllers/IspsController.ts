import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/IspService'

export default class IspsController {
  public async listIsps({ response, request, auth }: HttpContextContract) {
    if (!auth.user) return
    const { countryId } = request.qs()
    const isps = await service.listIsps(auth.user, countryId)
    return response.ok(isps)
  }
}
