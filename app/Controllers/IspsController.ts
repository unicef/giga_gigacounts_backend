import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Isp'

export default class IspsController {
  public async listIsps({ response, request }: HttpContextContract) {
    const { countryId, ltaId } = request.qs()
    const isps = await service.listIsps(ltaId, countryId)
    return response.ok(isps)
  }
}
