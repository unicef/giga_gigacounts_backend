import Database from '@ioc:Adonis/Lucid/Database'
import Attachment from 'App/Models/Attachment'
import Draft from 'App/Models/Draft'
import Payment from 'App/Models/Payment'
import NotFoundException from 'App/Exceptions/NotFoundException'

import storage from 'App/Services/Storage'
import FailedDependencyException from 'App/Exceptions/FailedDependencyException'
import Contract from 'App/Models/Contract'

export enum AttachmentsType {
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  DRAFT = 'draft',
  CONTRACT = 'contract',
}
export interface UploadRequest {
  file: string
  type: AttachmentsType
  typeId: number
  name: string
}

export interface DeleteRequest {
  attachmentId: number
  type: AttachmentsType
  typeId: number
}

const deleteAttachment = async (data: DeleteRequest) => {
  const trx = await Database.transaction()
  try {
    const attachment = await Attachment.find(data.attachmentId)
    if (!attachment) throw new NotFoundException('Attachment not found', 404, 'NOT_FOUND')

    await storage.deleteFile(attachment.url)

    if (data.type === AttachmentsType.DRAFT) {
      await attachment.related('drafts').detach()
    }

    if (data.type === AttachmentsType.CONTRACT) {
      await attachment.related('contracts').detach()
    }

    if (data.type === AttachmentsType.RECEIPT || data.type === AttachmentsType.INVOICE) {
      const payment = await Payment.find(data.typeId, { client: trx })
      if (!payment) throw new NotFoundException('Payment not found', 404, 'NOT_FOUND')
      payment[`${data.type}Id`] = null
      await payment.useTransaction(trx).save()
    }

    await attachment.useTransaction(trx).delete()

    return trx.commit()
  } catch (error) {
    await trx.rollback()
    if (error?.status == 404) throw error
    throw new FailedDependencyException(
      'Some dependency failed while uploading attachment',
      424,
      'FAILED_DEPENDENCY'
    )
  }
}

const uploadAttachment = async (data: UploadRequest): Promise<Attachment> => {
  const trx = await Database.transaction()
  try {
    const fileUrl = await storage.uploadFile(data.file)
    const attachment = await Attachment.create({ url: fileUrl, name: data.name }, { client: trx })

    if (data.type === AttachmentsType.DRAFT) {
      const draft = await Draft.find(data.typeId, { client: trx })
      if (!draft) throw new NotFoundException('Draft not found', 404, 'NOT_FOUND')
      await draft.related('attachments').attach([attachment.id], trx)
    }

    if (data.type === AttachmentsType.CONTRACT) {
      const contract = await Contract.find(data.typeId, { client: trx })
      if (!contract) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')
      await contract.related('attachments').attach([attachment.id], trx)
    }

    if (data.type === AttachmentsType.RECEIPT || data.type === AttachmentsType.INVOICE) {
      const payment = await Payment.find(data.typeId, { client: trx })
      if (!payment) throw new NotFoundException('Payment not found', 404, 'NOT_FOUND')
      payment[`${data.type}Id`] = attachment.id
      await payment.useTransaction(trx).save()
    }

    await trx.commit()

    return attachment
  } catch (error) {
    await trx.rollback()
    if (error?.status == 404) throw error
    throw new FailedDependencyException(
      'Some dependency failed while uploading attachment',
      424,
      'FAILED_DEPENDENCY'
    )
  }
}

const getAttachment = async (attachmentId: number): Promise<Attachment> => {
  const attachment = await Attachment.find(attachmentId)
  if (!attachment) throw new NotFoundException('Attachment not found', 404, 'NOT_FOUND')
  attachment.url = storage.generateSasToken(attachment.url)
  return attachment
}

export default {
  uploadAttachment,
  deleteAttachment,
  getAttachment,
}
