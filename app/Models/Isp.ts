import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
  BelongsTo,
  belongsTo
} from '@ioc:Adonis/Lucid/Orm'

import Contract from 'App/Models/Contract'
import Country from 'App/Models/Country'
import User from 'App/Models/User'

export default class Isp extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public countryId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @hasMany(() => Contract)
  public contracts: HasMany<typeof Contract>

  @belongsTo(() => Country)
  public country: BelongsTo<typeof Country>

  @manyToMany(() => User, {
    pivotTable: 'isp_users',
    localKey: 'id',
    pivotForeignKey: 'isp_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id'
  })
  public users: ManyToMany<typeof User>
}
