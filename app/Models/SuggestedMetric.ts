import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Metric from 'App/Models/Metric'

export default class SuggestedMetric extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public value: string

  @column()
  public metricId: number

  @column()
  public unit: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */
  @belongsTo(() => Metric, {
    serializeAs: 'metric',
  })
  public metric: BelongsTo<typeof Metric>
}
