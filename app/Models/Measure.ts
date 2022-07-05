import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Metric from 'App/Models/Metric'
import School from 'App/Models/School'
import Contract from 'App/Models/Contract'

export default class Measure extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public metricId: number

  @column()
  public value: number

  @column()
  public schoolId: number

  @column()
  public contractId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @belongsTo(() => Metric)
  public metric: BelongsTo<typeof Metric>

  @belongsTo(() => School)
  public school: BelongsTo<typeof School>

  @belongsTo(() => Contract)
  public contract: BelongsTo<typeof Contract>
}
