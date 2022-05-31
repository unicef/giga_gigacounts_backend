import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import Country from 'App/Models/Country'
import Measure from 'App/Models/Measure'
import Contract from 'App/Models/Contract'

export default class School extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public externalId: number

  @column()
  public name: string

  @column()
  public address: string

  @column({ columnName: 'location_1' })
  public location1: string

  @column({ columnName: 'location_2' })
  public location2: string

  @column({ columnName: 'location_3' })
  public location3: string

  @column({ columnName: 'location_4' })
  public location4: string

  @column()
  public educationLevel: string

  @column()
  public geopoint: string

  @column()
  public email: string

  @column()
  public phoneNumber: string

  @column()
  public contactPerson: string

  @column()
  public countryId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @belongsTo(() => Country)
  public country: BelongsTo<typeof Country>

  @hasMany(() => Measure)
  public measures: HasMany<typeof Measure>

  @manyToMany(() => Contract, {
    pivotTable: 'school_contracts',
    localKey: 'id',
    pivotForeignKey: 'school_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'contract_id',
  })
  public contracts: ManyToMany<typeof Contract>
}
