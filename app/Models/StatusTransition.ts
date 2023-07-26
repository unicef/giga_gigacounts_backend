import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'
import Contract from 'App/Models/Contract'

export default class StatusTransition extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public who: number

  @column()
  public contractId: string

  @column()
  public initialStatus: number

  @column()
  public finalStatus: number

  @column.dateTime({ autoCreate: true })
  public when: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public data?: Object

  /**
   * RELATIONSHIPS
   */
  @belongsTo(() => User, {
    localKey: 'who',
    foreignKey: 'id'
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Contract)
  public contract: BelongsTo<typeof Contract>
}
