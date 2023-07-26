import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'

import HelpRequest from 'App/Models/HelpRequest'

export default class HelpRequestValue extends BaseModel {
  @column()
  public id: number

  @column({ isPrimary: true })
  public code: string

  @column()
  public option: string

  /**
   * RELATIONSHIPS
   */
  @hasMany(() => HelpRequest)
  public feedbacks: HasMany<typeof HelpRequest>
}
