import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Measure from 'App/Models/Measure'
import ExpectedMetric from 'App/Models/ExpectedMetric'

export default class Metric extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @hasMany(() => Measure)
  public measures: HasMany<typeof Measure>

  @hasMany(() => ExpectedMetric)
  public expectedMetrics: HasMany<typeof ExpectedMetric>
}
