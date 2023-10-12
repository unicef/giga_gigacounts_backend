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
  LucidModel
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

import Role from 'App/Models/Role'
import Country from 'App/Models/Country'
import Contract from 'App/Models/Contract'
import Payment from 'App/Models/Payment'
import Isp from 'App/Models/Isp'
import School from 'App/Models/School'
import Draft from './Draft'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public countryId: number

  @column()
  public walletAddress?: string

  @column()
  public walletRequestString?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public about?: string

  @column()
  public address?: string

  @column()
  public zipCode?: string

  @column()
  public phoneNumber?: string

  @column()
  public photoUrl?: string

  @column()
  public automaticContractsEnabled?: boolean

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

  @belongsTo(() => Country as LucidModel, {
    serializeAs: 'country'
  })
  public country: BelongsTo<typeof Country>

  @manyToMany(() => Role as LucidModel, {
    pivotTable: 'user_roles',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id'
  })
  public roles: ManyToMany<typeof Role>

  @hasMany(() => Contract as LucidModel, {
    localKey: 'id',
    foreignKey: 'created_by'
  })
  public contracts: HasMany<typeof Contract>

  @hasMany(() => Payment as LucidModel, {
    localKey: 'id',
    foreignKey: 'paid_by'
  })
  public paymentsPaid: HasMany<typeof Payment>

  @hasMany(() => Payment as LucidModel, {
    localKey: 'id',
    foreignKey: 'createdBy'
  })
  public payments: HasMany<typeof Payment>

  @manyToMany(() => Isp as LucidModel, {
    pivotTable: 'isp_users',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'isp_id'
  })
  public isp: ManyToMany<typeof Isp>

  @manyToMany(() => School as LucidModel, {
    pivotTable: 'school_users',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'school_id'
  })
  public school: ManyToMany<typeof School>

  @manyToMany(() => Draft, {
    pivotTable: 'draft_isp_contacts',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'draft_id'
  })
  public ispContactDrafts: ManyToMany<typeof Draft>

  @manyToMany(() => Contract, {
    pivotTable: 'contract_isp_contacts',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'contract_id'
  })
  public ispContactContracts: ManyToMany<typeof Contract>

  @manyToMany(() => Draft, {
    pivotTable: 'draft_stakeholders',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'draft_id'
  })
  public stakeholdersDrafts: ManyToMany<typeof Draft>

  @manyToMany(() => Contract, {
    pivotTable: 'contract_stakeholders',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'contract_id'
  })
  public stakeholderContracts: ManyToMany<typeof Contract>
}
