import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import service from 'App/Services/NotificationSource'

export default class NotificationSourceController {
  public async listNotificationSource({ response, auth }: HttpContextContract) {
    if (!auth.user) return
    const notificationConfigs = await service.listNotificationSource()
    return response.ok(notificationConfigs)
  }

  public async getNotificationSourceById({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return
    const id = request.param('id') as number
    const notificationSources = await service.getNotificationSourcesById(id)
    return response.ok(notificationSources)
  }
}
