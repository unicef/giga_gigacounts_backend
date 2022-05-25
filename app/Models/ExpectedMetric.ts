import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Contract from 'App/Models/Contract'
import Metric from 'App/Models/Metric'

export default class ExpectedMetric extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public contractId: number

  @column()
  public metricId: number

  @column()
  public value: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @belongsTo(() => Contract)
  public contract: BelongsTo<typeof Contract>

  @belongsTo(() => Metric)
  public metric: BelongsTo<typeof Metric>
}
