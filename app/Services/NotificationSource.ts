import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import NotificationSources from 'App/Models/NotificationSources'
import { DateTime } from 'luxon'

export interface CreateNotificationSourceData {
  code?: string
  name?: string
  description?: string | number
  createAt?: DateTime
  updateAt?: DateTime
}

const listNotificationSource = async (): Promise<CreateNotificationSourceData[]> => {
  const query = NotificationSources.query()
  return query as
    | CreateNotificationSourceData[]
    | ModelQueryBuilderContract<typeof NotificationSources, NotificationSources>
}

const getNotificationSourcesById = async (id: number): Promise<NotificationSources> => {
  return (await NotificationSources.find(id)) as NotificationSources
}

export default {
  listNotificationSource,
  getNotificationSourcesById
}
