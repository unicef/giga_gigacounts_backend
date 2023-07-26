import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Contract from 'App/Models/Contract'

export default class Frequency extends BaseModel {
  @column({
    isPrimary: true,
    serialize: (value: number) => {
      return value.toString()
    }
  })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @hasMany(() => Contract)
  public contracts: HasMany<typeof Contract>
}
