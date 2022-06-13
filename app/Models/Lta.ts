import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'
import Isp from 'App/Models/Isp'
import Contract from 'App/Models/Contract'
import Country from 'App/Models/Country'

export default class Lta extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public createdBy: number

  @column()
  public countryId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @belongsTo(() => User, {
    localKey: 'created_by',
  })
  public user: BelongsTo<typeof User>

  @manyToMany(() => Isp, {
    pivotTable: 'lta_isps',
    localKey: 'id',
    pivotForeignKey: 'lta_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'isp_id',
  })
  public isps: ManyToMany<typeof Isp>

  @hasMany(() => Contract)
  public contracts: HasMany<typeof Contract>

  @belongsTo(() => Country)
  public country: BelongsTo<typeof Country>
}
