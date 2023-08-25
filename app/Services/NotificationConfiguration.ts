import { NotificationChannelType } from 'App/Helpers/constants'
import NotificationConfiguration from 'App/Models/NotificationConfiguration'
import Role from 'App/Models/Role'
import NotificationSource from 'App/Models/NotificationSource'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import NotFoundException from 'App/Exceptions/NotFoundException'
import NotificationMessage from 'App/Models/NotificationMessage'

export interface CreateNotificationConfigData {
  roleId: number
  sourceId: number
  channel: NotificationChannelType
  lockedForUser?: boolean
  readOnly?: boolean
  updateAt: DateTime
}

export interface CreateNotificationConfigMessageData {
  notificationConfigId: number
  preferredLanguage: string
  title: string
  message: string
  subMessage: string
}

const listNotificationConfiguration = async (
  channel?: NotificationChannelType
): Promise<NotificationConfiguration[]> => {
  const query = NotificationConfiguration.query()
  if (channel) {
    query.where('channel', channel as string)
  }
  return query as unknown as NotificationConfiguration[]
}

const getNotificationConfigurationById = async (id: number): Promise<NotificationConfiguration> => {
  return (await NotificationConfiguration.find(id)) as NotificationConfiguration
}

const deleteNotificationConfiguration = async (id: number): Promise<void> => {
  const config = await NotificationConfiguration.find(id)
  if (!config) throw new NotFoundException('Notification Configuration not found')
  const trx = await Database.transaction()
  try {
    await config.useTransaction(trx).delete()

    await trx.commit()
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

const createNotificationConfiguration = async (
  data: CreateNotificationConfigData
): Promise<NotificationConfiguration> => {
  const role = await Role.find(data.roleId)
  if (!role) throw new NotFoundException('Role not found')

  const source = await NotificationSource.find(data.sourceId)
  if (!source) throw new NotFoundException('Notification Source not found')

  const trx = await Database.transaction()
  try {
    const config = await NotificationConfiguration.create(data, { client: trx })

    await trx.commit()

    return config
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

const patchNotificationConfiguration = async (
  id: number,
  data: CreateNotificationConfigData
): Promise<NotificationConfiguration> => {
  let config = await NotificationConfiguration.find(id)
  if (!config) throw new NotFoundException('Notification Configuration not found')

  let role: Role
  if (data.roleId) {
    role = (await Role.find(data.roleId)) as Role
    if (!role) throw new NotFoundException('Role not found')
  }

  let source: NotificationSource
  if (data.sourceId) {
    source = (await NotificationSource.find(data.sourceId)) as NotificationSource
    if (!source) throw new NotFoundException('Notification Source not found')
  }

  const trx = await Database.transaction()
  try {
    config = config.useTransaction(trx).merge(data as unknown as NotificationConfiguration)
    await config.save()
    await trx.commit()

    return config
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

const listNotificationConfigurationMessages = async (
  configId: number
): Promise<NotificationMessage[]> => {
  const query = NotificationMessage.query().where('notificationConfigId', configId)
  return query as unknown as NotificationMessage[]
}

const getNotificationConfigurationMessagesById = async (
  configId: number,
  messageId: number
): Promise<NotificationMessage> => {
  return (await NotificationMessage.query()
    .where('id', messageId)
    .where('notificationConfigId', configId)
    .first()) as NotificationMessage
}

const createNotificationConfigurationMessage = async (
  data: CreateNotificationConfigMessageData
): Promise<NotificationMessage> => {
  const config = await NotificationConfiguration.find(data.notificationConfigId)
  if (!config) throw new NotFoundException('Notification Configuration not found')

  const trx = await Database.transaction()
  try {
    const configMsg = await NotificationMessage.create(data, { client: trx })

    await trx.commit()

    return configMsg
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

const deleteNotificationConfigurationMessage = async (
  configId: number,
  messageId: number
): Promise<void> => {
  let message = (await NotificationMessage.query()
    .where('id', messageId)
    .where('notificationConfigId', configId)
    .first()) as NotificationMessage
  if (!message) throw new NotFoundException('Notification Message not found')

  const trx = await Database.transaction()
  try {
    await message.useTransaction(trx).delete()

    await trx.commit()
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

const patchNotificationConfigurationMessage = async (
  configId: number,
  messageId: number,
  data: CreateNotificationConfigMessageData
): Promise<NotificationMessage> => {
  let message = (await NotificationMessage.query()
    .where('id', messageId)
    .where('notificationConfigId', configId)
    .first()) as NotificationMessage
  if (!message) throw new NotFoundException('Notification Message not found')

  const trx = await Database.transaction()
  try {
    message = message.useTransaction(trx).merge({
      preferredLanguage: data.preferredLanguage,
      message: data.message,
      subMessage: data.subMessage,
      title: data.title
    } as NotificationMessage)
    await message.save()
    await trx.commit()

    return message
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

export default {
  listNotificationConfiguration,
  getNotificationConfigurationById,
  deleteNotificationConfiguration,
  createNotificationConfiguration,
  patchNotificationConfiguration,

  listNotificationConfigurationMessages,
  getNotificationConfigurationMessagesById,
  createNotificationConfigurationMessage,
  deleteNotificationConfigurationMessage,
  patchNotificationConfigurationMessage
}
