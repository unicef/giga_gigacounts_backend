import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/FrequencyService'

export default class FrequenciesController {
  public async listFrequencies({ response, auth }: HttpContextContract) {
    if (!auth.user) return
    const frequencies = await service.listFrequency()
    return response.ok(frequencies)
  }
}
