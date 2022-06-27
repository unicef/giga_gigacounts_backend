import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

import Contract from 'App/Models/Contract'
import Payment from './Payment'
import Draft from './Draft'

export default class Attachment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public url: string

  @column()
  public name: string

  @column()
  public ipfsUrl: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @manyToMany(() => Contract, {
    pivotTable: 'contract_attachments',
    localKey: 'id',
    pivotForeignKey: 'attachment_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'contract_id',
  })
  public contracts: ManyToMany<typeof Contract>

  @hasMany(() => Payment, {
    localKey: 'id',
    foreignKey: 'invoice_id',
  })
  public paymentInvoice: HasMany<typeof Payment>

  @hasMany(() => Payment, {
    localKey: 'id',
    foreignKey: 'receiptId',
  })
  public paymentReceipt: HasMany<typeof Payment>

  @manyToMany(() => Draft, {
    pivotTable: 'draft_attachments',
    localKey: 'id',
    pivotForeignKey: 'attachment_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'draft_id',
  })
  public drafts: ManyToMany<typeof Draft>
}
