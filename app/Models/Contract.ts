import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import Country from 'App/Models/Country'
import Lta from 'App/Models/Lta'
import Currency from 'App/Models/Currency'
import Frequency from 'App/Models/Frequency'
import Isp from 'App/Models/Isp'
import User from 'App/Models/User'
import ExpectedMetric from 'App/Models/ExpectedMetric'
import Attachment from 'App/Models/Attachment'
import School from 'App/Models/School'
import Payment from 'App/Models/Payment'
import Measure from 'App/Models/Measure'

export default class Contract extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public countryId: number

  @column()
  public governmentBehalf: boolean

  @column()
  public name: string

  @column()
  public ltaId: number

  @column()
  public currencyId: number

  @column()
  public budget: string

  @column({
    serialize: (value: number) => {
      return value.toString()
    },
  })
  public frequencyId: number

  @column.dateTime()
  public startDate: DateTime

  @column.dateTime()
  public endDate: DateTime

  @column()
  public ispId: number

  @column()
  public createdBy: number

  @column()
  public status: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

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
    localKey: 'created_by',
    foreignKey: 'id',
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => ExpectedMetric)
  public expectedMetrics: HasMany<typeof ExpectedMetric>

  @manyToMany(() => Attachment, {
    pivotTable: 'contract_attachments',
    localKey: 'id',
    pivotForeignKey: 'contract_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'attachment_id',
  })
  public attachments: ManyToMany<typeof Attachment>

  @manyToMany(() => School, {
    pivotTable: 'school_contracts',
    localKey: 'id',
    pivotForeignKey: 'contract_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'school_id',
  })
  public schools: ManyToMany<typeof School>

  @hasMany(() => Payment)
  public payments: HasMany<typeof Payment>

  @hasMany(() => Measure)
  public measures: HasMany<typeof Measure>
}
