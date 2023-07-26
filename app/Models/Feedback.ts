import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Feedback extends BaseModel {
  @column({
    isPrimary: true,
    serialize: (value: number) => {
      return value.toString()
    }
  })
  public id: number

  @column()
  public rate: number

  @column()
  public comment: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
