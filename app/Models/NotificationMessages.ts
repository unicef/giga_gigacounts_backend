import { BaseModel, column, HasOne, hasOne, LucidModel } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import NotificationConfiguration from 'App/Models/NotificationConfiguration'

export default class NotificationMessages extends BaseModel {
  @column({
    isPrimary: true,
    serialize: (value: number) => value.toString()
  })
  public id?: number

  @column()
  public preferredLanguage: string

  @column()
  public title: string

  @column()
  public message: string

  @column()
  public subMessage: string

  @column()
  public notificationConfigId: number

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime

  @column.dateTime({ autoUpdate: true })
  public updatedAt?: DateTime

  @column()
  public email?: string

  /**
   * RELATIONSHIPS
   */

  @hasOne(() => NotificationConfiguration as LucidModel, {
    localKey: 'notificationConfigId',
    foreignKey: 'id'
  })
  public configuration: HasOne<typeof NotificationConfiguration>
}
