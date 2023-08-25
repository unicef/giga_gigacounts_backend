import { BaseModel, column, HasOne, hasOne, LucidModel } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { NotificationStatusType } from 'App/Helpers/constants'
import User from 'App/Models/User'
import NotificationConfiguration from 'App/Models/NotificationConfiguration'

export default class Notification extends BaseModel {
  public static table = 'notifications'

  @column({ isPrimary: true })
  public id?: number

  @column()
  public title?: string

  @column()
  public message: string

  @column()
  public subMessage?: string

  @column()
  public userId: number

  @column()
  public configId: number

  @column()
  public status: NotificationStatusType

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime

  @column.dateTime()
  public viewedAt?: DateTime

  @column.dateTime()
  public sentAt?: DateTime

  @column.dateTime()
  public discardedAt?: DateTime

  @column()
  public email?: string

  @hasOne(() => User as LucidModel, {
    localKey: 'userId',
    foreignKey: 'id'
  })
  public user: HasOne<typeof User>

  @hasOne(() => NotificationConfiguration as LucidModel, {
    localKey: 'configId',
    foreignKey: 'id'
  })
  public configuration: HasOne<typeof NotificationConfiguration>
}
