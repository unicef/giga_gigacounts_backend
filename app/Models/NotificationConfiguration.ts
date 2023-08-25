import {
  BaseModel,
  beforeFind,
  column,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
  LucidModel,
  ModelQueryBuilderContract
} from '@ioc:Adonis/Lucid/Orm'
import NotificationSource from 'App/Models/NotificationSource'
import Role from 'App/Models/Role'
import { NotificationChannelType } from 'App/Helpers/constants'
import { DateTime } from 'luxon'
import NotificationMessage from 'App/Models/NotificationMessage'
import Notification from './Notification'

export default class NotificationConfiguration extends BaseModel {
  public static table = 'notification_configurations'

  @column({
    isPrimary: true,
    serialize: (value: number) => {
      return value.toString()
    }
  })
  public id?: number

  @column()
  public channel: NotificationChannelType

  @column()
  public lockedForUser: boolean

  @column()
  public readOnly: boolean

  @column({ serializeAs: 'roleId' })
  public roleId: number

  @column({ serializeAs: 'sourceId' })
  public sourceId: number

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt?: DateTime

  @column()
  public priority: number

  @beforeFind()
  public static beforeFindRelations(
    query: ModelQueryBuilderContract<typeof NotificationConfiguration>
  ) {
    query.preload('notificationSource').preload('role')
  }

  /**
   * RELATIONSHIPS
   */

  @hasOne(() => NotificationSource as LucidModel, {
    localKey: 'sourceId',
    foreignKey: 'id'
  })
  public notificationSource: HasOne<typeof NotificationSource>

  @hasOne(() => Role as LucidModel, {
    localKey: 'roleId',
    foreignKey: 'id'
  })
  public role: HasOne<typeof Role>

  @hasMany(() => NotificationMessage as LucidModel)
  public messages: HasMany<typeof NotificationMessage>

  @hasMany(() => Notification as LucidModel, {
    localKey: 'id',
    foreignKey: 'configId'
  })
  public notification: HasMany<typeof Notification>
}
