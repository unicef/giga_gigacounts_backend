import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasOne,
  hasOne,
  ManyToMany,
  manyToMany
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

  @column({ serializeAs: 'countryId' })
  public countryId?: number

  @column({ serializeAs: 'governmentBehalf' })
  public governmentBehalf?: boolean

  @column()
  public automatic?: boolean

  @column()
  public name: string

  @column({ serializeAs: 'ltaId' })
  public ltaId?: number

  @column({ serializeAs: 'currencyId' })
  public currencyId?: number

  @column()
  public budget?: number

  @column({ serializeAs: 'frequencyId' })
  public frequencyId?: number

  @column.dateTime({ serializeAs: 'startDate' })
  public startDate?: DateTime

  @column.dateTime({ serializeAs: 'endDate' })
  public endDate?: DateTime

  @column.dateTime({ serializeAs: 'launchDate' })
  public launchDate?: DateTime

  @column({ serializeAs: 'ispId' })
  public ispId?: number

  @column({ serializeAs: 'createdBy' })
  public createdBy?: number

  @column({
    serialize: (value: { schools: { id: string }[] }) => {
      return value?.schools
    }
  })
  public schools?: { schools: { external_id: string; budget: number }[] }

  @column()
  public expectedMetrics?: { metrics: { metricId: string; value: number }[] }

  @column.dateTime({ autoCreate: true })
  public createdAt?: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt?: DateTime

  @column()
  public notes?: string

  @column()
  public breakingRules?: string

  @column({ serializeAs: 'paymentReceiverId' })
  public paymentReceiverId?: number

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
    foreignKey: 'createdBy'
  })
  public user: BelongsTo<typeof User>

  @manyToMany(() => Attachment, {
    pivotTable: 'draft_attachments',
    localKey: 'id',
    pivotForeignKey: 'draft_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'attachment_id'
  })
  public attachments: ManyToMany<typeof Attachment>

  @manyToMany(() => User, {
    pivotTable: 'draft_isp_contacts',
    localKey: 'id',
    pivotForeignKey: 'draft_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id'
  })
  public ispContacts: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'draft_stakeholders',
    localKey: 'id',
    pivotForeignKey: 'draft_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id'
  })
  public stakeholders: ManyToMany<typeof User>

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'paymentReceiverId'
  })
  public paymentReceiver: BelongsTo<typeof User>

}
