import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'

import Contract from 'App/Models/Contract'
import Payment from 'App/Models/Payment'

export default class Currency extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @hasMany(() => Contract)
  public contracts: HasMany<typeof Contract>

  @hasOne(() => Payment, {
    localKey: 'id',
    foreignKey: 'currency_id',
  })
  public payments: HasOne<typeof Payment>
}
