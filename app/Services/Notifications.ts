import { DateTime } from 'luxon'
import Notification from 'App/Models/Notification'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Database from '@ioc:Adonis/Lucid/Database'
import Feedback from 'App/Models/Feedback'
import User from 'App/Models/User'
import NotificationConfiguration from 'App/Models/NotificationConfiguration'
import HelpRequest from 'App/Models/HelpRequest'
import {
  NotificationChannel,
  NotificationStatus,
  NotificationChannelType,
  NotificationStatusType,
  NotificationSources
} from 'App/Helpers/constants'
import DatabaseException from 'App/Exceptions/DatabaseException'
import userService from 'App/Services/User'

export interface NotificationData {
  id: number
  userId: number
  configId: number
  status: NotificationStatusType
  title?: string
  message: string
  subMessage?: string
  createdAt?: DateTime
  viewedAt?: DateTime
  discardedAt?: DateTime
  sentAt?: DateTime
  email?: string
  priority: number
}

const getFilteredNotifications = async (
  channels: Array<string>,
  status: Array<string>,
  userId?: number,
  notificationId?: number,
  priority?: number
): Promise<NotificationData[]> => {
  try {
    let someFilter = false
    let rawQuery = `
    SELECT distinct n.*, nc.priority
    FROM notifications n 
    inner join notification_configurations nc on n.config_id = nc.id`

    if (channels?.length) {
      someFilter = true
      rawQuery += ' where nc.channel in (' + channels.map((item) => `'${item}'`).join(',') + ')'
    }
    if (status?.length) {
      rawQuery +=
        (someFilter ? ' and ' : ' where ') +
        'n.status in (' +
        status.map((item) => `'${item}'`).join(',') +
        ')'
      someFilter = true
    }
    if (userId) {
      rawQuery += (someFilter ? ' and ' : ' where ') + 'n.user_id = ' + userId.toString()
      someFilter = true
    }
    if (notificationId) {
      rawQuery += (someFilter ? ' and ' : ' where ') + 'n.id = ' + notificationId.toString()
      someFilter = true
    }
    if (priority) {
      rawQuery += (someFilter ? ' and ' : ' where ') + 'nc.priority = ' + priority.toString()
    }
    rawQuery += ' order by created_at desc'
    const query = await Database.rawQuery(rawQuery)


    return query.rows as NotificationData[]
    
    /*
    let query = Notification.query()
    .select('notifications.*', 'notification_configurations.priority')
    .innerJoin(
      'notification_configurations',
      'notifications.config_id',
      'notification_configurations.id'
    );

    if (channels?.length) {
      query = query.whereIn('notification_configurations.channel', channels);
    }
    if (status?.length) {
      query = query.whereIn('notifications.status', status);
    }
    if (userId) {
      query = query.where('notifications.user_id', userId);
    }
    if (notificationId) {
      query = query.where('notifications.id', notificationId);
    }
    if (priority) {
      query = query.where('notification_configurations.priority', priority);
    }

    query = query.orderBy('created_at', 'desc');

    const notifications = await query;

    const mappedNotifications: NotificationData[] = notifications.map((notification) => ({
      id: notification.id || 0,
      userId: notification.userId,
      configId: notification.configId,
      status: notification.status,
      title: notification.title,
      message: notification.message,
      subMessage: notification.subMessage,
      createdAt: notification.createdAt,
      viewedAt: notification.viewedAt,
      discardedAt: notification.discardedAt,
      sentAt: notification.sentAt,
      email: notification.email,
      priority: notification.configuration?.priority
    }));

    return mappedNotifications;
    */
  } catch (ex) {
    console.error(ex)
    throw new DatabaseException('Some database error occurred while getting notifications')
  }
}

const getNotifications = async (
  channels: Array<string>,
  status: Array<string>,
  priority?: number
): Promise<NotificationData[]> => {
  return await getFilteredNotifications(channels, status, undefined, undefined, priority)
}

const getNotificationsByUserId = async (
  userId: number,
  channels: Array<string>,
  status: Array<string>,
  priority?: number
): Promise<NotificationData[]> => {
  return await getFilteredNotifications(channels, status, userId, undefined, priority)
}

const getNotificationsById = async (
  id: number,
  userId: number,
  channels: Array<string>,
  status: Array<string>,
  priority?: number
): Promise<NotificationData> => {
  const notifications: NotificationData[] = await getFilteredNotifications(
    channels,
    status,
    userId,
    id,
    priority
  )
  return notifications[0]
}

const changeStatusNotificationsById = async (id: number, status: string): Promise<Notification> => {
  let notification = (await Notification.query().where('id', id).first()) as Notification
  if (!notification) throw new NotFoundException('Notification not found')

  const trx = await Database.transaction()
  try {
    const data = { status: status } as Notification
    switch (status.toUpperCase()) {
      case 'READ':
        data.viewedAt = DateTime.now()
        break
      case 'DISCARDED':
        data.discardedAt = DateTime.now()
        break
      case 'SENT':
        data.sentAt = DateTime.now()
        break
      default:
        break
    }

    notification = notification.useTransaction(trx).merge(data)
    await notification.save()
    await trx.commit()
    return notification
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

const createNotificationByOperation = async (notificationOperation, contractId: string) => {
  const client = await Database.transaction()
  try {
    await client.rawQuery('select notifications_create_messages(?, ?);', [
      notificationOperation,
      contractId
    ])
    await client.commit()
  } catch (error) {
    console.error('Error creating a new notification for: ' + notificationOperation, error)
    await client.rollback()
  }
}

const getCotificationConfig = async (
  notificationOperation: string,
  notificationChannel: NotificationChannelType
) => {
  const notificationConfig = await NotificationConfiguration.query()
    .select('notification_configurations.id')
    .join(
      'notification_sources',
      'notification_sources.id',
      'notification_configurations.source_id'
    )
    .where('notification_sources.code', notificationOperation)
    .andWhere('notification_configurations.channel', notificationChannel)

  return notificationConfig
}

const createGenericNotification = async (
  notificationOperation: string,
  notificationChannel: NotificationChannelType,
  title: string,
  message: string
) => {
  const notification = new Notification()

  try {
    const user = await userService.getGigaSuperAdminUser()
    if (!user) return notification
    const notificationConfig = await getCotificationConfig(
      notificationOperation,
      notificationChannel
    )

    notification.title = title
    notification.message = message
    notification.userId = user[0].id
    notification.configId = notificationConfig[0].id as number
    notification.status =
      notificationChannel === NotificationChannel.EMAIL
        ? NotificationStatus.CREATED
        : NotificationStatus.SENT
    notification.email = user[0].email
    notification.sentAt = notificationChannel === NotificationChannel.API
    ? DateTime.now() : undefined
    
    await Database.transaction(async (trx) => {
      await notification.useTransaction(trx).save()
    })
  } catch (error) {
    console.error('Error creating a new notification for: ' + notificationOperation, error)
  }

  return notification
}

const createHelpRequestNotifications = async (
  helpRequest: HelpRequest,
  userFrom: User
): Promise<Notification[]> => {
  const title = `Gigacounts - Help Request from User ${userFrom.email}`
  const message = `
  ID: ${helpRequest.id},
  Code: ${helpRequest.code},
  Functionality: ${helpRequest.functionality},
  Type of Help Request: ${helpRequest.type},
  Description: ${helpRequest.description};
  Created by: ${userFrom.email},
  Created at: ${helpRequest.createdAt}
  `
  const emailNotification: Notification = await createGenericNotification(
    NotificationSources.helpRequest,
    NotificationChannel.EMAIL,
    title,
    message
  )
  const apiNotification: Notification = await createGenericNotification(
    NotificationSources.helpRequest,
    NotificationChannel.API,
    title,
    message
  )
  return [emailNotification, apiNotification]
}

const createFeedbackNotifications = async (
  feedback: Feedback,
  userFrom: User
): Promise<Notification[]> => {
  const title = `Gigacounts - Feedback from User ${userFrom.email}`
  const message = `
  ID: ${feedback.id},
  Rate: ${feedback.rate},
  Comment: ${feedback.comment};
  Created by: ${userFrom.email},
  Created at: ${feedback.createdAt}
  `
  const emailNotification: Notification = await createGenericNotification(
    NotificationSources.feedback,
    NotificationChannel.EMAIL,
    title,
    message
  )
  const apiNotification: Notification = await createGenericNotification(
    NotificationSources.feedback,
    NotificationChannel.API,
    title,
    message
  )
  return [emailNotification, apiNotification]
}

const createGenericAutomaticContractNotifications = async (
  message: string
): Promise<Notification[]> => {
  const title = 'Gigacounts - Automatic Contract Information'
  const emailNotification: Notification = await createGenericNotification(
    NotificationSources.automaticContractGeneric,
    NotificationChannel.EMAIL,
    title,
    message
  )
  const apiNotification: Notification = await createGenericNotification(
    NotificationSources.automaticContractGeneric,
    NotificationChannel.API,
    title,
    message
  )
  return [emailNotification, apiNotification]
}

export default {
  getNotifications,
  getNotificationsByUserId,
  getNotificationsById,
  changeStatusNotificationsById,
  createNotificationByOperation,
  createHelpRequestNotifications,
  createFeedbackNotifications,
  createGenericAutomaticContractNotifications
}
