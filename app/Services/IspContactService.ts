import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import Draft from 'App/Models/Draft'
import NotFoundException from 'App/Exceptions/NotFoundException'

import DatabaseException from 'App/Exceptions/DatabaseException'
import User from 'App/Models/User'
import ExternalContact from 'App/Models/ExternalContact'
export interface UploadRequest {
  draftId: number
  userId?: number
  name?: string
  email?: string
  phoneNumber?: string
  countryId?: number
  ispId?: number
}

const uploadIspContact = async (
  data: UploadRequest,
  isExternalUser: boolean,
  trx?: TransactionClientContract
) => {
  const transactionBdd = trx || (await Database.transaction())
  try {
    if (isExternalUser) {
      let savedContact
      const draft = await Draft.find(data.draftId, { client: transactionBdd })
      if (!draft) throw new NotFoundException('Draft not found')

      savedContact = await ExternalContact.findBy('email', data.email)

      if (!savedContact) {
        savedContact = await ExternalContact.create({
          ispId: data.ispId,
          countryId: data.countryId,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber
        })
      }

      await draft.related('externalContacts').attach([savedContact.id], transactionBdd)

      if (!trx) await transactionBdd.commit()

      return { ok: true, message: 'Relation was created' }
    } else {
      if (data.userId && data.draftId) {
        const user = await User.find(data.userId, { client: transactionBdd })
        if (!user) throw new NotFoundException('User not found')
        const draft = await Draft.find(data.draftId, { client: transactionBdd })
        if (!draft) throw new NotFoundException('Draft not found')
        await draft.related('ispContacts').attach([user.id], transactionBdd)

        if (!trx) await transactionBdd.commit()

        return { ok: true, message: 'Relation was created' }
      } else {
        throw new Error('The userId and the draftId are required for internal contacts.')
      }
    }
  } catch (error) {
    await transactionBdd.rollback()
    if ([404, 413].some((status) => status === error?.status)) throw error
    throw new DatabaseException('Some database error occurred while uploading isp contact')
  }
}

const deleteIspContact = async (data: UploadRequest, isExternalUser: boolean) => {
  try {
    if (isExternalUser) {
      let savedContact
      savedContact = await ExternalContact.findBy('email', data.email)

      if (!savedContact) throw new NotFoundException('External contact not found')

      const externalContactRelation = await Database.from('draft_external_contacts')
        .where('draft_id', data.draftId)
        .andWhere('external_contact_id', savedContact.id)

      if (externalContactRelation.length === 0) throw new NotFoundException('Relation not found')

      await Database.from('draft_external_contacts')
        .where('draft_id', data.draftId)
        .andWhere('external_contact_id', savedContact.id)
        .delete()

      return { ok: true, message: 'Relation was deleted' }
    } else {
      if (data.userId && data.draftId) {
        const ispContactRelation = await Database.from('draft_isp_contacts')
          .where('draft_id', data.draftId)
          .andWhere('user_id', data.userId)

        if (ispContactRelation.length === 0) throw new NotFoundException('Relation not found')

        await Database.from('draft_isp_contacts')
          .where('draft_id', data.draftId)
          .andWhere('user_id', data.userId)
          .delete()

        return { ok: true, message: 'Relation was deleted' }
      }
    }
  } catch (error) {
    if (error?.status === 404) throw error
    throw new DatabaseException('Some database error occurred while deleting isp contact relation')
  }
}

export default {
  uploadIspContact,
  deleteIspContact
}
