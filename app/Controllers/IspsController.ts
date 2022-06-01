import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Isp'

export default class IspsController {
  public async listIsps({ response }: HttpContextContract) {
    const isps = await service.listIsps()
    return response.ok(isps)
  }
}
