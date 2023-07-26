import { DateTime } from 'luxon'
import Notifications from 'App/Models/Notifications'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Database from '@ioc:Adonis/Lucid/Database'
import { NotificationStatus } from 'App/Helpers/constants'
import Feedback from 'App/Models/Feedback'
import User from 'App/Models/User'
import NotificationConfiguration from 'App/Models/NotificationConfiguration'
import HelpRequest from 'App/Models/HelpRequest'
export interface CreateNotificationData {
  id: number
  userId: number
  configId: number
  status: NotificationStatus
  title?: string
  message: string
  subMessage?: string
  createdAt?: DateTime
  viewedAt?: DateTime
  discardedAt?: DateTime
  sentAt?: DateTime
  email?: string
}

const getNotifications = async (
  channels: Array<string>,
  status: Array<string>
): Promise<CreateNotificationData[]> => {
  const query = Notifications.query().select('notifications.*')

  if (channels?.length) {
    query
      .join(
        'notification_configurations',
        'notifications.config_id',
        'notification_configurations.id'
      )
      .whereIn('notification_configurations.channel', channels)
  }

  if (status?.length) {
    query.andWhereIn('status', status)
  }

  return query as unknown as CreateNotificationData[]
}

const getNotificationsByUserId = async (
  userId: number,
  channels: Array<string>,
  status: Array<string>
): Promise<CreateNotificationData[]> => {
  const query = Notifications.query().select('notifications.*').where('userId', userId)

  if (channels?.length) {
    query
      .join(
        'notification_configurations',
        'notifications.config_id',
        'notification_configurations.id'
      )
      .whereIn('notification_configurations.channel', channels)
  }

  if (status?.length) {
    query.andWhereIn('status', status)
  }

  return query as unknown as CreateNotificationData[]
}

const getNotificationsById = async (
  id: number,
  userId: number,
  channels: Array<string>,
  status: Array<string>
): Promise<Notifications> => {
  const query = Notifications.query()
    .select('notifications.*')
    .where('notifications.id', id)
    .andWhere('userId', userId)

  if (channels?.length) {
    query
      .join(
        'notification_configurations',
        'notifications.config_id',
        'notification_configurations.id'
      )
      .whereIn('notification_configurations.channel', channels)
  }

  if (status?.length) {
    query.andWhereIn('status', status)
  }

  return (await query.first()) as Notifications
}

const changeStatusNotificationsById = async (
  id: number,
  userId: number,
  status: string
): Promise<Notifications> => {
  let notification = (await Notifications.query()
    .where('id', id)
    .andWhere('userId', userId)
    .first()) as Notifications
  if (!notification) throw new NotFoundException('Notification not found', 404, 'NOT_FOUND')

  const trx = await Database.transaction()
  try {
    const data = { status: status } as Notifications
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

const getGigaSuperAdminRole = async () => {
  const user = await User.query()
    .join('user_roles', (query) => {
      query.on((subquery) => {
        subquery.on('users.id', '=', 'user_roles.user_id')
      })
    })
    .join('roles', (query) => {
      query.on((subquery) => {
        subquery.on('roles.id', '=', 'user_roles.role_id')
      })
    })
    .where('roles.code', '=', 'GIGA.SUPER.ADMIN')

  return user
}

const getCotificationConfig = async (notificationOperation: string) => {
  const notificationConfig = await NotificationConfiguration.query()
    .select('notification_configurations.id')
    .join(
      'notification_sources',
      'notification_sources.id',
      'notification_configurations.source_id'
    )
    .where('notification_sources.code', notificationOperation)

  return notificationConfig
}

const createHelpRequestNotification = async (
  notificationOperation: string,
  helpRequest: HelpRequest,
  userFrom: User
) => {
  try {
    const user = await getGigaSuperAdminRole()

    const notificationConfig = await getCotificationConfig(notificationOperation)

    const notification = new Notifications()

    notification.title = `Help Request Giga Application ID ${helpRequest.id}`
    notification.message = `
    ID: ${helpRequest.id},
    Code: ${helpRequest.code},
    Functionality: ${helpRequest.functionality},
    Type of Help Request: ${helpRequest.type},
    Description: ${helpRequest.description};
    Created by: ${userFrom.email},
    Created at: ${helpRequest.createdAt}
    `
    notification.userId = user[0].id
    notification.configId = notificationConfig[0].id as number
    notification.status = 'CREATED'
    notification.email = user[0].email

    await Database.transaction(async (trx) => {
      await notification.useTransaction(trx).save()
    })

    return notification
  } catch (error) {
    console.error('Error creating a new notification for: ' + notificationOperation, error)
  }
}

const createFeedbackNotification = async (
  notificationOperation: string,
  feedback: Feedback,
  userFrom: User
) => {
  try {
    const user = await getGigaSuperAdminRole()
    const notificationConfig = await getCotificationConfig(notificationOperation)

    const notification = new Notifications()

    notification.title = `Feedback Giga Application ID ${feedback.id}`
    notification.message = `
    ID: ${feedback.id},
    Rate: ${feedback.rate},
    Comment: ${feedback.comment};
    Created by: ${userFrom.email},
    Created at: ${feedback.createdAt}
    `
    notification.userId = user[0].id
    notification.configId = notificationConfig[0].id as number
    notification.status = 'CREATED'
    notification.email = user[0].email

    await Database.transaction(async (trx) => {
      await notification.useTransaction(trx).save()
    })

    return notification
  } catch (error) {
    console.error('Error creating a new notification for: ' + notificationOperation, error)
  }
}

export default {
  getNotifications,
  getNotificationsByUserId,
  getNotificationsById,
  changeStatusNotificationsById,
  createNotificationByOperation,
  createHelpRequestNotification,
  createFeedbackNotification
}
