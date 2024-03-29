import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import Draft from 'App/Models/Draft'
import NotFoundException from 'App/Exceptions/NotFoundException'

import DatabaseException from 'App/Exceptions/DatabaseException'
import User from 'App/Models/User'
export interface UploadRequest {
  draftId: number
  userId: number
}

const uploadStakeholder = async (data: UploadRequest, trx?: TransactionClientContract) => {
  const transactionBdd = trx || (await Database.transaction())
  try {
    const user = await User.find(data.userId, { client: transactionBdd })
    if (!user) throw new NotFoundException('User not found')
    const draft = await Draft.find(data.draftId, { client: transactionBdd })
    if (!draft) throw new NotFoundException('Draft not found')
    await draft.related('stakeholders').attach([user.id], transactionBdd)

    if (!trx) await transactionBdd.commit()

    return { ok: true, message: 'Relation was created' }
  } catch (error) {
    await transactionBdd.rollback()
    if ([404, 413].some((status) => status === error?.status)) throw error
    throw new DatabaseException('Some database error occurred while uploading isp contact')
  }
}

const deleteStakeholder = async (data: UploadRequest) => {
  try {
    const ispContactRelation = await Database.from('draft_stakeholders')
      .where('draft_id', data.draftId)
      .andWhere('user_id', data.userId)
    if (ispContactRelation.length === 0) throw new NotFoundException('Relation not found')

    await Database.from('draft_stakeholders')
      .where('draft_id', data.draftId)
      .andWhere('user_id', data.userId)
      .delete()

    return { ok: true, message: 'Relation was deleted' }
  } catch (error) {
    if (error?.status === 404) throw error
    throw new DatabaseException('Some database error occurred while deleting isp contact relation')
  }
}

export default {
  uploadStakeholder,
  deleteStakeholder
}
