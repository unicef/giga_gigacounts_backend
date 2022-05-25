import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasOne,
  HasOne,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'

import Role from 'App/Models/Role'
import Country from 'App/Models/Country'
import Lta from 'App/Models/Lta'
import Contract from 'App/Models/Contract'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public country_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * RELATIONSHIPS
   */

  @hasOne(() => Country)
  public country: HasOne<typeof Country>

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
  })
  public roles: ManyToMany<typeof Role>

  @hasMany(() => Lta)
  public ltas: HasMany<typeof Lta>

  @hasMany(() => Contract)
  public contracts: HasMany<typeof Contract>
}
