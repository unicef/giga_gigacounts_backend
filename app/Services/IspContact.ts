import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import Draft from 'App/Models/Draft'
import NotFoundException from 'App/Exceptions/NotFoundException'

import FailedDependencyException from 'App/Exceptions/FailedDependencyException'
import User from 'App/Models/User'
export interface UploadRequest {
  draftId: number
  userId: number
}

const uploadIspContact = async (data: UploadRequest, trx?: TransactionClientContract) => {
  const transactionBdd = trx || (await Database.transaction())
  try {
    const user = await User.find(data.userId, { client: transactionBdd })
    if (!user) throw new NotFoundException('User not found', 404, 'NOT_FOUND')
    const draft = await Draft.find(data.draftId, { client: transactionBdd })
    if (!draft) throw new NotFoundException('Draft not found', 404, 'NOT_FOUND')
    await draft.related('ispContacts').attach([user.id], transactionBdd)

    if (!trx) await transactionBdd.commit()

    return { ok: true, message: 'Relation was created' }
  } catch (error) {
    await transactionBdd.rollback()
    if ([404, 413].some((status) => status === error?.status)) throw error
    throw new FailedDependencyException(
      'Some database error occurred while uploading isp contact',
      424,
      'DATABASE_ERROR'
    )
  }
}

const deleteIspContact = async (data: UploadRequest) => {
  try {
    const ispContactRelation = await Database.from('draft_isp_contacts')
      .where('draft_id', data.draftId)
      .andWhere('user_id', data.userId)

    if (ispContactRelation.length === 0)
      throw new NotFoundException('Relation not found', 404, 'NOT_FOUND')

    await Database.from('draft_isp_contacts')
      .where('draft_id', data.draftId)
      .andWhere('user_id', data.userId)
      .delete()

    return { ok: true, message: 'Relation was deleted' }
  } catch (error) {
    if (error?.status === 404) throw error
    throw new FailedDependencyException(
      'Some database error occurred while deleting isp contact relation',
      424,
      'DATABASE_ERROR'
    )
  }
}

export default {
  uploadIspContact,
  deleteIspContact
}
