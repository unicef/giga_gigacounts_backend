import { DateTime } from 'luxon'
import {
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
  BaseModel,
  LucidModel
} from '@ioc:Adonis/Lucid/Orm'

import Country from 'App/Models/Country'
import Currency from 'App/Models/Currency'
import Frequency from 'App/Models/Frequency'
import Isp from 'App/Models/Isp'
import User from 'App/Models/User'
import ExpectedMetric from 'App/Models/ExpectedMetric'
import Attachment from 'App/Models/Attachment'
import School from 'App/Models/School'
import Payment from 'App/Models/Payment'
import Measure from 'App/Models/Measure'
import ExternalContact from './ExternalContact'

export default class Contract extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public countryId: number

  @column()
  public governmentBehalf: boolean

  @column()
  public automatic: boolean

  @column()
  public name: string

  @column()
  public currencyId: number

  @column()
  public budget: number

  @column({
    serialize: (value: number) => {
      return value.toString()
    }
  })
  public frequencyId: number

  @column.dateTime()
  public startDate: DateTime

  @column.dateTime()
  public endDate: DateTime

  @column.dateTime()
  public launchDate: DateTime

  @column()
  public ispId: number

  @column()
  public createdBy: number

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public notes: string

  @column()
  public breakingRules: string

  @column()
  public cashback: number

  @column()
  public cashbackVerified: boolean

  @column()
  public signRequestString: string

  @column()
  public signedWithWallet: boolean

  @column()
  public signedWalletAddress: string

  @column({ serializeAs: 'paymentReceiverId' })
  public paymentReceiverId?: number

  public meetsSla?: boolean

  /**
   * RELATIONSHIPS
   */

  @belongsTo(() => Country as LucidModel)
  public country: BelongsTo<typeof Country>

  @belongsTo(() => Currency as LucidModel)
  public currency: BelongsTo<typeof Currency>

  @belongsTo(() => Frequency as LucidModel)
  public frequency: BelongsTo<typeof Frequency>

  @belongsTo(() => Isp as LucidModel)
  public isp: BelongsTo<typeof Isp>

  @belongsTo(() => User as LucidModel, {
    localKey: 'created_by',
    foreignKey: 'id'
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => ExpectedMetric as LucidModel)
  public expectedMetrics: HasMany<typeof ExpectedMetric>

  @manyToMany(() => Attachment as LucidModel, {
    pivotTable: 'contract_attachments',
    localKey: 'id',
    pivotForeignKey: 'contract_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'attachment_id'
  })
  public attachments: ManyToMany<typeof Attachment>

  @manyToMany(() => User as LucidModel, {
    pivotTable: 'contract_isp_contacts',
    localKey: 'id',
    pivotForeignKey: 'contract_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id'
  })
  public ispContacts: ManyToMany<typeof User>

  @manyToMany(() => User as LucidModel, {
    pivotTable: 'contract_stakeholders',
    localKey: 'id',
    pivotForeignKey: 'contract_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id'
  })
  public stakeholders: ManyToMany<typeof User>

  @manyToMany(() => ExternalContact, {
    pivotTable: 'contract_external_contacts',
    localKey: 'id',
    pivotForeignKey: 'contract_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'external_contact_id'
  })
  public externalContacts: ManyToMany<typeof ExternalContact>

  @manyToMany(() => School as LucidModel, {
    pivotTable: 'school_contracts',
    localKey: 'id',
    pivotForeignKey: 'contract_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'school_id',
    pivotColumns: ['budget']
  })
  public schools: ManyToMany<typeof School>

  @hasMany(() => Payment as LucidModel)
  public payments: HasMany<typeof Payment>

  @hasMany(() => Measure as LucidModel)
  public measures: HasMany<typeof Measure>

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'paymentReceiverId'
  })
  public paymentReceiver: BelongsTo<typeof User>
}
