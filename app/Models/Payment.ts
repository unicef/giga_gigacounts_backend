import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import Attachment from 'App/Models/Attachment'
import Contract from 'App/Models/Contract'
import User from 'App/Models/User'
import Currency from 'App/Models/Currency'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public dateFrom: DateTime

  @column.dateTime()
  public dateTo?: DateTime

  @column()
  public invoiceId: number | null

  @column()
  public receiptId: number | null

  @column()
  public isVerified: boolean

  @column()
  public contractId: number

  @column()
  public paidBy?: number

  @column()
  public amount: number

  @column()
  public currencyId: number

  @column()
  public description?: string

  @column()
  public status: number

  @column()
  public createdBy: number

  @column()
  public metrics?: { red: number; orange: number; green: number }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @belongsTo(() => Attachment, {
    localKey: 'invoice_id',
  })
  public invoice: BelongsTo<typeof Attachment>

  @belongsTo(() => Attachment, {
    localKey: 'receipt_id',
  })
  public receipt: BelongsTo<typeof Attachment>

  @belongsTo(() => Contract)
  public contract: BelongsTo<typeof Contract>

  @belongsTo(() => User, {
    localKey: 'paid_by',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Currency)
  public currency: BelongsTo<typeof Currency>

  @belongsTo(() => User, {
    localKey: 'created_by',
  })
  public creator: BelongsTo<typeof User>
}
