import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFind,
  column,
  hasMany,
  HasMany,
  ModelQueryBuilderContract
} from '@ioc:Adonis/Lucid/Orm'

import Measure from 'App/Models/Measure'
import ExpectedMetric from 'App/Models/ExpectedMetric'
import SuggestedMetric from 'App/Models/SuggestedMetric'

export default class Metric extends BaseModel {
  @column({
    isPrimary: true,
    serialize: (value: number) => {
      return value.toString()
    }
  })
  public id: number

  @column()
  public code: string

  @column()
  public name: string

  @column()
  public unit: string

  @column()
  public weight: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * HOOKS
   */

  @beforeFind()
  public static getSuggestedMetrics(query: ModelQueryBuilderContract<typeof Metric>) {
    query.preload('suggestedMetrics')
  }

  /**
   * RELATIONSHIPS
   */

  @hasMany(() => Measure)
  public measures: HasMany<typeof Measure>

  @hasMany(() => ExpectedMetric)
  public expectedMetrics: HasMany<typeof ExpectedMetric>

  @hasMany(() => SuggestedMetric)
  public suggestedMetrics: HasMany<typeof SuggestedMetric>
}
