import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  HasOne,
  hasOne,
  manyToMany,
  ManyToMany
} from '@ioc:Adonis/Lucid/Orm'

import Contract from 'App/Models/Contract'
import Payment from 'App/Models/Payment'
import Country from './Country'

export default class Currency extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public type: number

  @column()
  public contractAddress: string

  @column()
  public networkId: number

  @column()
  public enabled: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @hasMany(() => Contract)
  public contracts: HasMany<typeof Contract>

  @hasOne(() => Payment, {
    localKey: 'id',
    foreignKey: 'currency_id'
  })
  public payments: HasOne<typeof Payment>

  @manyToMany(() => Country, {
    pivotTable: 'country_currencies',
    localKey: 'id',
    pivotForeignKey: 'currency_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'country_id'
  })
  public countries: ManyToMany<typeof Country>
}
