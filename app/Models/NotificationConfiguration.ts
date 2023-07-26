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
import NotificationSources from 'App/Models/NotificationSources'
import Role from 'App/Models/Role'
import { NotificationChannel } from 'App/Helpers/constants'
import { DateTime } from 'luxon'
import NotificationMessages from 'App/Models/NotificationMessages'

export default class NotificationConfiguration extends BaseModel {
  @column({
    isPrimary: true,
    serialize: (value: number) => {
      return value.toString()
    }
  })
  public id?: number

  @column()
  public channel: NotificationChannel

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

  @beforeFind()
  public static beforeFindRelations(
    query: ModelQueryBuilderContract<typeof NotificationConfiguration>
  ) {
    query.preload('notificationSource').preload('role')
  }

  /**
   * RELATIONSHIPS
   */

  @hasOne(() => NotificationSources as LucidModel, {
    localKey: 'sourceId',
    foreignKey: 'id'
  })
  public notificationSource: HasOne<typeof NotificationSources>

  @hasOne(() => Role as LucidModel, {
    localKey: 'roleId',
    foreignKey: 'id'
  })
  public role: HasOne<typeof Role>

  @hasMany(() => NotificationMessages as LucidModel)
  public messages: HasMany<typeof NotificationMessages>
}
