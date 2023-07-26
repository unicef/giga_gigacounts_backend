import { DateTime } from 'luxon'
import {
  BaseModel,
  LucidModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
  computed
} from '@ioc:Adonis/Lucid/Orm'

import Country from 'App/Models/Country'
import Measure from 'App/Models/Measure'
import Contract from 'App/Models/Contract'
import User from 'App/Models/User'
export default class School extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public externalId: string

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

  @column()
  public gigaIdSchool: string

  @column()
  public reliableMeasures: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public budget: number

  /**
   * RELATIONSHIPS
   */

  @belongsTo(() => Country as LucidModel)
  public country: BelongsTo<typeof Country>

  @hasMany(() => Measure as LucidModel)
  public measures: HasMany<typeof Measure>

  @manyToMany(() => Contract as LucidModel, {
    pivotTable: 'school_contracts',
    localKey: 'id',
    pivotForeignKey: 'school_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'contract_id',
    pivotColumns: ['budget']
  })
  public contracts: ManyToMany<typeof Contract>

  @manyToMany(() => User, {
    pivotTable: 'school_users',
    localKey: 'id',
    pivotForeignKey: 'school_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id'
  })
  public users: ManyToMany<typeof User>
}
