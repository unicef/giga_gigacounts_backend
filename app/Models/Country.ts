import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'
import School from 'App/Models/School'
import Contract from 'App/Models/Contract'

export default class Country extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public flagUrl: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @hasMany(() => School)
  public schools: HasMany<typeof School>

  @hasMany(() => Contract)
  public contracts: HasMany<typeof Contract>
}
