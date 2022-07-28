import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import Isp from 'App/Models/Isp'
import Frequency from 'App/Models/Frequency'
import Currency from 'App/Models/Currency'
import Lta from 'App/Models/Lta'
import Country from 'App/Models/Country'
import User from 'App/Models/User'
import Attachment from 'App/Models/Attachment'

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
  public schools?: { schools: { id: string }[] }

  @column()
  public expectedMetrics?: { metrics: { metricId: string; value: number }[] }

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

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'createdBy',
  })
  public user: BelongsTo<typeof User>

  @manyToMany(() => Attachment, {
    pivotTable: 'draft_attachments',
    localKey: 'id',
    pivotForeignKey: 'draft_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'attachment_id',
  })
  public attachments: ManyToMany<typeof Attachment>
}
