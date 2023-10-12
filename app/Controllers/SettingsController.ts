import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import service from 'App/Services/SettingService'

export default class SettingsController {
  public async getSettings({ response, request, auth }: HttpContextContract) {
    if (!auth.user) return

    let apps: Array<string> = (request.qs().apps as Array<string>) || []
    let keys: Array<string> = (request.qs().keys as Array<string>) || []

    if (!Array.isArray(apps)) {
      apps = [apps]
    }

    if (!Array.isArray(keys)) {
      keys = [keys]
    }

    const data = await service.getSettings(keys || [])
    return response.ok(data)
  }

  public async getSettingValue({ response, request, auth }: HttpContextContract) {
    if (!auth.user) return
    const { key } = request.params()

    if (!key) {
      return response.ok('')
    }
    const data = await service.getSettingValue(key.toLowerCase())
    return response.ok(data)
  }
}
