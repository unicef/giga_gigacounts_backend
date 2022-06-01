import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Lta from 'App/Models/Lta'
import Contract from 'App/Models/Contract'

export default class Isp extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @manyToMany(() => Lta, {
    pivotTable: 'lta_isps',
    localKey: 'id',
    pivotForeignKey: 'isp_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'lta_id',
  })
  public ltas: ManyToMany<typeof Lta>

  @hasMany(() => Contract)
  public contracts: HasMany<typeof Contract>
}
