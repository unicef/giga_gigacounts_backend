import { BaseModel, column, HasOne, hasOne, LucidModel } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import User from 'App/Models/User'
import Contract from 'App/Models/Contract'

export default class BlockchainTransaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public contractId?: number

  @column()
  public walletAddress: string

  @column()
  public networkId: number

  @column()
  public networkName: string

  @column()
  public transactionType: string

  @column()
  public transactionHash: string

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @hasOne(() => User as LucidModel, {
    localKey: 'userId',
    foreignKey: 'id'
  })
  public user: HasOne<typeof User>

  @hasOne(() => Contract as LucidModel, {
    localKey: 'contractId',
    foreignKey: 'id'
  })
  public contract: HasOne<typeof Contract>
}
