import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import Attachment from 'App/Models/Attachment'
import Draft from 'App/Models/Draft'
import Payment from 'App/Models/Payment'
import NotFoundException from 'App/Exceptions/NotFoundException'

import storage from 'App/Services/Storage'
import DatabaseException from 'App/Exceptions/DatabaseException'
import Contract from 'App/Models/Contract'
import User from 'App/Models/User'
import paymentService from 'App/Services/Payment'

export enum AttachmentsType {
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  DRAFT = 'draft',
  CONTRACT = 'contract'
}
export interface UploadRequest {
  file: string
  type: AttachmentsType
  typeId: number
  name: string
}

export interface DeleteRequest {
  attachmentId: number
  paymentId: number
}

const deleteAttachment = async (
  attachmentId: number,
  user: User,
  trx?: TransactionClientContract
) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const transactionBdd = trx || (await Database.transaction())
  try {
    const attachment = await Attachment.find(attachmentId)
    if (!attachment) throw new NotFoundException('Attachment not found')

    await attachment.useTransaction(transactionBdd).load('paymentInvoice')
    await attachment.useTransaction(transactionBdd).load('paymentReceipt')

    if (attachment.paymentInvoice.length) {
      await deletefromPayment(attachment.paymentInvoice[0].id, 'invoice', transactionBdd)
      await paymentService.checkPaymentFileEdit(
        attachment.paymentInvoice[0].id,
        user.id,
        transactionBdd
      )
    }

    if (attachment.paymentReceipt.length) {
      await deletefromPayment(attachment.paymentReceipt[0].id, 'receipt', transactionBdd)
      await paymentService.checkPaymentFileEdit(
        attachment.paymentReceipt[0].id,
        user.id,
        transactionBdd
      )
    }

    await attachment.related('drafts').detach()
    await attachment.related('contracts').detach()

    await storage.deleteFile(attachment.url)
    await attachment.useTransaction(transactionBdd).delete()

    if (!trx) return transactionBdd.commit()
  } catch (error) {
    await transactionBdd.rollback()
    if (error?.status === 404) throw error
    throw new DatabaseException('Some database error occurred while uploading attachment')
  }
}

const uploadAttachment = async (
  data: UploadRequest,
  trx?: TransactionClientContract
): Promise<Attachment> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const transactionBdd = trx || (await Database.transaction())
  try {
    const fileUrl = await storage.uploadFile(data.file)
    const attachment = await Attachment.create(
      { url: fileUrl, name: data.name },
      { client: transactionBdd }
    )

    if (data.type === AttachmentsType.DRAFT) {
      const draft = await Draft.find(data.typeId, { client: transactionBdd })
      if (!draft) throw new NotFoundException('Draft not found')
      await draft.related('attachments').attach([attachment.id], transactionBdd)
    }

    if (data.type === AttachmentsType.CONTRACT) {
      const contract = await Contract.find(data.typeId, { client: transactionBdd })
      if (!contract) throw new NotFoundException('Contract not found')
      await contract.related('attachments').attach([attachment.id], transactionBdd)
    }

    if (data.type === AttachmentsType.RECEIPT || data.type === AttachmentsType.INVOICE) {
      const payment = await Payment.find(data.typeId, { client: transactionBdd })
      if (!payment) throw new NotFoundException('Payment not found')
      payment[`${data.type}Id`] = attachment.id
      await payment.useTransaction(transactionBdd).save()
    }

    if (!trx) await transactionBdd.commit()

    return attachment
  } catch (error) {
    await transactionBdd.rollback()
    if ([404, 413].some((status) => status === error?.status)) throw error
    throw new DatabaseException('Some database error occurred while uploading attachment')
  }
}

const getAttachment = async (attachmentId: number): Promise<Attachment> => {
  const attachment = await Attachment.find(attachmentId)
  if (!attachment) throw new NotFoundException('Attachment not found')
  attachment.url = storage.generateSasToken(attachment.url)
  return attachment
}

const deletefromPayment = async (
  paymentId: number,
  type: string,
  trx: TransactionClientContract
) => {
  const payment = await Payment.find(paymentId, { client: trx })
  if (payment) {
    payment[`${type}Id`] = null
    await payment.useTransaction(trx).save()
  }
}

export default {
  uploadAttachment,
  deleteAttachment,
  getAttachment
}
