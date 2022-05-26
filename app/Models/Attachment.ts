import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

import Contract from 'App/Models/Contract'
import Payment from './Payment'

export default class Attachment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public url: string

  @column()
  public ipfsUrl: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
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

  @hasMany(() => Payment)
  public payments: HasMany<typeof Payment>
}
