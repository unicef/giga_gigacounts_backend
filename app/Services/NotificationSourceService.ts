import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import NotificationSource from 'App/Models/NotificationSource'
import { DateTime } from 'luxon'

export interface CreateNotificationSourceData {
  code?: string
  name?: string
  description?: string | number
  createAt?: DateTime
  updateAt?: DateTime
}

const listNotificationSource = async (): Promise<CreateNotificationSourceData[]> => {
  const query = NotificationSource.query()
  return query as
    | CreateNotificationSourceData[]
    | ModelQueryBuilderContract<typeof NotificationSource, NotificationSource>
}

const getNotificationSourcesById = async (id: number): Promise<NotificationSource> => {
  return (await NotificationSource.find(id)) as NotificationSource
}

export default {
  listNotificationSource,
  getNotificationSourcesById
}
