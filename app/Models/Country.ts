import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'
import School from 'App/Models/School'
import Contract from 'App/Models/Contract'
import Lta from 'App/Models/Lta'
import Currency from './Currency'

export default class Country extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public flagUrl: string

  @column()
  public preferredLanguage: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
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

  @hasMany(() => Lta)
  public ltas: HasMany<typeof Lta>

  @manyToMany(() => Currency, {
    pivotTable: 'country_currencies',
    localKey: 'id',
    pivotForeignKey: 'country_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'currency_id'
  })
  public currencies: ManyToMany<typeof Currency>
}
