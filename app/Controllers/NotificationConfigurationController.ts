import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import service, {
  CreateNotificationConfigData,
  CreateNotificationConfigMessageData
} from 'App/Services/NotificationConfiguration'

export default class NotificationConfigurationController {
  public async listNotificationConfigurations({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return
    const { channel } = request.qs()
    const notificationConfigs = await service.listNotificationConfiguration(channel)
    return response.ok(notificationConfigs)
  }

  public async getNotificationConfigurationsById({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return
    const id = request.param('id') as number
    const notificationConfig = await service.getNotificationConfigurationById(id)
    return response.ok(notificationConfig)
  }

  public async createNotificationConfiguration({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return
    const data = request.body() as CreateNotificationConfigData
    const notificationResponse = await service.createNotificationConfiguration(data)
    return response.ok(notificationResponse)
  }

  public async deleteNotificationConfiguration({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return
    const id = request.param('id') as number
    await service.deleteNotificationConfiguration(id)
    return response.noContent()
  }

  public async patchNotificationConfiguration({ request, response, auth }: HttpContextContract) {
    if (!auth.user) return
    const id = request.param('id') as number
    const data = request.body() as CreateNotificationConfigData
    const notificationResponse = await service.patchNotificationConfiguration(id, data)
    return response.ok(notificationResponse)
  }

  public async listNotificationConfigurationsMessage({
    request,
    response,
    auth
  }: HttpContextContract) {
    if (!auth.user) return
    const id = request.param('configId') as number
    const notificationConfig = await service.listNotificationConfigurationMessages(id)
    return response.ok(notificationConfig)
  }

  public async getNotificationConfigurationsMessageById({
    request,
    response,
    auth
  }: HttpContextContract) {
    if (!auth.user) return
    const id = request.param('configId') as number
    const messageId = request.param('messageId') as number
    const notificationConfig = await service.getNotificationConfigurationMessagesById(id, messageId)
    return response.ok(notificationConfig)
  }

  public async createNotificationConfigurationMessage({
    request,
    response,
    auth
  }: HttpContextContract) {
    if (!auth.user) return
    const data = request.body() as CreateNotificationConfigMessageData
    data.notificationConfigId = request.param('configId') as number
    const notificationResponse = await service.createNotificationConfigurationMessage(data)
    return response.ok(notificationResponse)
  }

  public async deleteNotificationConfigurationMessage({
    request,
    response,
    auth
  }: HttpContextContract) {
    if (!auth.user) return
    const configId = request.param('configId') as number
    const messageId = request.param('messageId') as number
    await service.deleteNotificationConfigurationMessage(configId, messageId)
    return response.noContent()
  }

  public async patchNotificationConfigurationMessage({
    request,
    response,
    auth
  }: HttpContextContract) {
    if (!auth.user) return
    const configId = request.param('configId') as number
    const messageId = request.param('messageId') as number
    const data = request.body() as CreateNotificationConfigMessageData
    const notificationResponse = await service.patchNotificationConfigurationMessage(
      configId,
      messageId,
      data
    )
    return response.ok(notificationResponse)
  }
}
