import { BaseModel, column, HasMany, hasMany, LucidModel } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import NotificationConfiguration from 'App/Models/NotificationConfiguration'

export default class NotificationSources extends BaseModel {
  @column({
    isPrimary: true,
    serialize: (value: number) => {
      return value.toString()
    }
  })
  public id?: number

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public description: number

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt?: DateTime

  /**
   * RELATIONSHIPS
   */

  @hasMany(() => NotificationConfiguration as LucidModel)
  public configs: HasMany<typeof NotificationConfiguration>
}
