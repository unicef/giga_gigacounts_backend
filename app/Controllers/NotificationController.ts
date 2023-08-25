import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import service from 'App/Services/Notifications'

export default class NotificationController {
  // Example filter by 2 status: {{BASE_URL}}/notifications?status=CREATED&channel=EMAIL

  public async getNotifications({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return
    let channels: Array<string> = (request.qs().channel as Array<string>) || []
    let status: Array<string> = (request.qs().status as Array<string>) || []
    let priority: number = request.qs().priority as number

    if (!Array.isArray(channels)) {
      channels = [channels]
    }

    if (!Array.isArray(status)) {
      status = [status]
    }

    const notifications = await service.getNotifications(channels || [], status || [], priority)
    return response.ok(notifications)
  }

  // Example filter by 2 status: {{BASE_URL}}/user/3/notifications?status=READ&status=SENT
  // Example filter by 2 status and channel: {{BASE_URL}}/user/3/notifications?status=READ&status=SENT&channel=API
  public async getNotificationsByUserId({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return
    const userId = request.param('userId') as number
    let channels: Array<string> = (request.qs().channel as Array<string>) || []
    let status: Array<string> = (request.qs().status as Array<string>) || []
    let priority: number = request.qs().priority as number

    if (!Array.isArray(channels)) {
      channels = [channels]
    }

    if (!Array.isArray(status)) {
      status = [status]
    }

    const notificationConfigs = await service.getNotificationsByUserId(
      userId,
      channels || [],
      status || [],
      priority
    )
    return response.ok(notificationConfigs)
  }

  public async getNotificationById({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return
    const id = request.param('notificationId') as number
    const userId = request.param('userId') as number
    let channels: Array<string> = (request.qs().channel as Array<string>) || []
    let status: Array<string> = (request.qs().status as Array<string>) || []
    let priority: number = request.qs().priority as number

    if (!Array.isArray(channels)) {
      channels = [channels]
    }

    if (!Array.isArray(status)) {
      status = [status]
    }

    const notificationSources = await service.getNotificationsById(
      id,
      userId,
      channels || [],
      status || [],
      priority
    )
    return response.ok(notificationSources)
  }

  public async markAsReadNotificationsById({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return
    const id = request.param('notificationId') as number
    const notificationSources = await service.changeStatusNotificationsById(id, 'READ')
    return response.ok(notificationSources)
  }

  public async markAsDiscardedNotificationsById({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return
    const id = request.param('notificationId') as number
    const notificationSources = await service.changeStatusNotificationsById(id, 'DISCARDED')
    return response.ok(notificationSources)
  }

  public async markAsSentNotificationsById({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return
    const id = request.param('notificationId') as number
    const notificationSources = await service.changeStatusNotificationsById(id, 'SENT')
    return response.ok(notificationSources)
  }
}
