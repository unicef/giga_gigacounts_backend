import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFind,
  column,
  manyToMany,
  ManyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import Permission from 'App/Models/Permission'
import User from 'App/Models/User'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  /**
   * HOOKS
   */

  @beforeFind()
  public static getPermissions(query: ModelQueryBuilderContract<typeof Role>) {
    query.preload('permissions')
  }

  /**
   * RELATIONSHIPS
   */

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'permission_id',
  })
  public permissions: ManyToMany<typeof Permission>

  @manyToMany(() => User, {
    pivotTable: 'user_roles',
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  public users: ManyToMany<typeof User>
}
