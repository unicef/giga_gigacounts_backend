import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon/src/luxon'

import FailedDependencyException from 'App/Exceptions/FailedDependencyException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import AlreadyHasPaymentException from 'App/Exceptions/AlreadyHasPaymentException'
import InvalidStatusException from 'App/Exceptions/InvalidStatusException'

import Frequency from 'App/Models/Frequency'
import Payment from 'App/Models/Payment'
import Contract from 'App/Models/Contract'
import User from 'App/Models/User'

import attachmentService, { AttachmentsType } from 'App/Services/Attachment'
import userService from 'App/Services/User'
import measureService from 'App/Services/Measure'
import utils from 'App/Helpers/utils'
import { PaymentStatus, roles, ContractStatus } from 'App/Helpers/constants'

import dto from 'App/DTOs/Payment'

interface File {
  file: string
  name: string
}

export interface CreatePaymentData {
  month: number
  year: number
  description?: string
  currencyId: string
  amount: number
  invoice: File
  receipt?: File
  contractId: string
}

const listFrequencies = async (): Promise<Frequency[]> => {
  return Frequency.all()
}

const createPayment = async (data: CreatePaymentData, user: User) => {
  const trx = await Database.transaction()
  try {
    const contract = await Contract.find(data.contractId, { client: trx })
    if (!contract) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')
    if (contract.status === ContractStatus.Completed)
      throw new InvalidStatusException('Invalid status', 400, 'INVALID_STATUS')

    const { dateFrom, dateTo } = utils.makeFromAndToDate(data.month, data.year, contract.endDate)

    if (await checkPaymentInSameMonthYear(dateFrom, dateTo, contract.id)) {
      throw new AlreadyHasPaymentException(
        'Contract already has payment on that month-year',
        422,
        'ALREADY_HAS_PAYMENT'
      )
    }

    const status = userService.checkUserRole(user, [roles.government, roles.countryOffice])
      ? PaymentStatus.Verified
      : PaymentStatus.Pending

    const metrics = await measureService.calculateMeasuresByMonthYear({
      contractId: contract.id,
      month: data.month,
      year: data.year,
    })

    const payment = await Payment.create(
      {
        dateFrom,
        dateTo,
        contractId: contract.id,
        amount: data.amount,
        currencyId: parseInt(data.currencyId),
        description: data.description,
        status: status,
        createdBy: user.id,
        metrics: metrics,
      },
      { client: trx }
    )

    const invoice = await attachmentService.uploadAttachment(
      { ...data.invoice, type: AttachmentsType.INVOICE, typeId: payment.id },
      trx
    )
    payment.invoiceId = invoice.id

    if (data.receipt) {
      const receipt = await attachmentService.uploadAttachment(
        {
          ...data.receipt,
          type: AttachmentsType.RECEIPT,
          typeId: payment.id,
        },
        trx
      )
      payment.receiptId = receipt.id
    }

    await payment.useTransaction(trx).save()
    await trx.commit()

    return payment
  } catch (error) {
    await trx.rollback()
    if ([404, 422, 400].some((status) => status === error?.status)) throw error
    throw new FailedDependencyException(
      'Some dependency failed while uploading attachment',
      424,
      'FAILED_DEPENDENCY'
    )
  }
}

const checkPaymentInSameMonthYear = async (
  dateFrom: DateTime,
  dateTo: DateTime,
  contractId: number
) => {
  const payments = await Payment.query()
    .where('date_from', '<=', dateFrom.toString())
    .where('date_to', '>=', dateTo.toString())
    .where('contractId', contractId)
  return payments.length > 0
}

const getPaymentsByContract = async (contractId: string) => {
  const contract = await Contract.find(contractId)
  if (!contract) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')
  const payments = await Payment.query().where('contract_id', contractId).preload('currency')
  await Promise.all(
    payments.map(async (payment) => {
      if (payment.invoiceId) await payment.load('invoice')
      if (payment.receiptId) await payment.load('receipt')
    })
  )
  return dto.getPaymentsByContractDTO(payments)
}

const getPayment = async (paymentId: string) => {
  const payment = await Payment.find(paymentId)
  if (!payment) throw new NotFoundException('Payment not found', 404, 'NOT_FOUND')
  await payment.load('currency')
  await payment.load('creator')
  await payment.creator.load('roles')
  if (payment.invoiceId) await payment.load('invoice')
  if (payment.receiptId) await payment.load('receipt')
  return dto.getPaymentDTO(payment)
}

export default {
  listFrequencies,
  createPayment,
  getPaymentsByContract,
  getPayment,
}
