import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import Isp from 'App/Models/Isp'
import Frequency from 'App/Models/Frequency'
import Currency from 'App/Models/Currency'
import Lta from 'App/Models/Lta'
import Country from 'App/Models/Country'

export default class Draft extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public countryId?: number

  @column()
  public governmentBehalf?: boolean

  @column()
  public name: string

  @column()
  public ltaId?: number

  @column()
  public currencyId?: number

  @column()
  public budget?: string

  @column()
  public frequencyId?: number

  @column.dateTime()
  public startDate?: DateTime

  @column.dateTime()
  public endDate?: DateTime

  @column()
  public ispId?: number

  @column()
  public createdBy?: number

  @column()
  public attachments?: { attachments: { id: number }[] }

  @column()
  public schools?: { schools: { id: number }[] }

  @column()
  public expectedMetrics?: { metrics: { metricId: number; value: number }[] }

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt?: DateTime

  /**
   * RELATIONSHIPS
   */

  @belongsTo(() => Country)
  public country: BelongsTo<typeof Country>

  @belongsTo(() => Lta)
  public lta: BelongsTo<typeof Lta>

  @belongsTo(() => Currency)
  public currency: BelongsTo<typeof Currency>

  @belongsTo(() => Frequency)
  public frequency: BelongsTo<typeof Frequency>

  @belongsTo(() => Isp)
  public isp: BelongsTo<typeof Isp>
}
