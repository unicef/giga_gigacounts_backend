import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasOne, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'
import HelpRequestValue from 'App/Models/HelpRequestValue'

export default class HelpRequest extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public description: string

  @column()
  public path: string

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasOne(() => HelpRequestValue, {
    localKey: 'code',
    foreignKey: 'code'
  })
  public feedbackValues: HasOne<typeof HelpRequestValue>
}
