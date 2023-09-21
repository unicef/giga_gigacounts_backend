import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Isp from 'App/Models/Isp'
import Country from 'App/Models/Country'

export default class ExternalContact extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ispId: number

  @column()
  public countryId: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public phoneNumber: string

  /**
   * RELATIONSHIPS
   */

  @belongsTo(() => Isp, {
    foreignKey: 'ispId'
  })
  public isp: BelongsTo<typeof Isp>

  @belongsTo(() => Country, {
    foreignKey: 'countryId'
  })
  public country: BelongsTo<typeof Country>
}
