import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Isp'

export default class IspsController {
  public async listIsps({ response, request, auth }: HttpContextContract) {
    if (!auth.user) return
    const { countryId, ltaId } = request.qs()
    const isps = await service.listIsps(auth.user, ltaId, countryId)
    return response.ok(isps)
  }
}
