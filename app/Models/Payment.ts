import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'

import Attachment from 'App/Models/Attachment'
import Contract from 'App/Models/Contract'
import User from 'App/Models/User'
import Currency from 'App/Models/Currency'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ serializeAs: 'dateFrom' })
  public dateFrom: DateTime

  @column.dateTime({ serializeAs: 'dateTo' })
  public dateTo?: DateTime

  @column({ serializeAs: 'invoiceId' })
  public invoiceId: number | null

  @column({ serializeAs: 'receiptId' })
  public receiptId: number | null

  @column({ serializeAs: 'isVerified' })
  public isVerified: boolean

  @column({ serializeAs: 'contractId' })
  public contractId: number

  @column({ serializeAs: 'paidBy' })
  public paidBy?: number

  @column()
  public amount: number

  @column({
    serializeAs: 'currencyId',
    serialize: (value: number) => {
      return value.toString()
    },
  })
  public currencyId: number

  @column()
  public description?: string

  @column()
  public status: number

  @column({ serializeAs: 'createdBy' })
  public createdBy: number

  @column()
  public metrics?: {
    withoutConnection: number
    atLeastOneBellowAvg: number
    allEqualOrAboveAvg: number
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @hasOne(() => Attachment, {
    localKey: 'invoiceId',
  })
  public invoice: HasOne<typeof Attachment>

  @hasOne(() => Attachment, {
    localKey: 'receiptId',
  })
  public receipt: HasOne<typeof Attachment>

  @belongsTo(() => Contract)
  public contract: BelongsTo<typeof Contract>

  @hasOne(() => User, {
    localKey: 'paidBy',
    foreignKey: 'id',
  })
  public user: HasOne<typeof User>

  @hasOne(() => Currency, {
    localKey: 'currencyId',
    foreignKey: 'id',
  })
  public currency: HasOne<typeof Currency>

  @hasOne(() => User, {
    localKey: 'createdBy',
    foreignKey: 'id',
  })
  public creator: HasOne<typeof User>
}
