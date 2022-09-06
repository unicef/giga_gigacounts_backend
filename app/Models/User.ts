import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
  beforeCreate,
  beforeFind,
  ModelQueryBuilderContract,
  belongsTo,
  BelongsTo,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

import Role from 'App/Models/Role'
import Country from 'App/Models/Country'
import Lta from 'App/Models/Lta'
import Contract from 'App/Models/Contract'
import Payment from 'App/Models/Payment'
import Safe from 'App/Models/Safe'
import Isp from 'App/Models/Isp'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public countryId: number

  @column()
  public safeId?: number

  @column()
  public walletAddress?: string

  @column()
  public walletRequestString?: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  /**
   * HOOKS
   */

  @beforeCreate()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeFind()
  public static getCountry(query: ModelQueryBuilderContract<typeof User>) {
    query.preload('country').preload('roles')
  }

  /**
   * RELATIONSHIPS
   */

  @belongsTo(() => Country, {
    serializeAs: 'country',
  })
  public country: BelongsTo<typeof Country>

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

  @hasMany(() => Contract, {
    localKey: 'id',
    foreignKey: 'created_by',
  })
  public contracts: HasMany<typeof Contract>

  @hasMany(() => Payment, {
    localKey: 'id',
    foreignKey: 'paid_by',
  })
  public paymentsPaid: HasMany<typeof Payment>

  @hasMany(() => Payment, {
    localKey: 'id',
    foreignKey: 'createdBy',
  })
  public payments: HasMany<typeof Payment>

  @hasOne(() => Safe, {
    localKey: 'safeId',
    foreignKey: 'id',
  })
  public safe: HasOne<typeof Safe>

  @manyToMany(() => Isp, {
    pivotTable: 'isp_users',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'isp_id',
  })
  public isp: ManyToMany<typeof Isp>
}
