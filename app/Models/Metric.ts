import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFind,
  column,
  hasMany,
  HasMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import Measure from 'App/Models/Measure'
import ExpectedMetric from 'App/Models/ExpectedMetric'
import SuggestedMetric from 'App/Models/SuggestedMetric'

export default class Metric extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
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
