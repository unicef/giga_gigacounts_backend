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
  invoice?: File
  receipt?: File
  contractId: string
}

export interface ChangePaymentStatusData {
  paymentId: number
  status: PaymentStatus
}

export interface UpdatePaymentData {
  paymentId: string
  description?: string
  month?: number
  year?: number
  amount?: number
  invoice?: File
  receipt?: File
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

    const status = userService.checkUserRole(user, [
      roles.government,
      roles.countryOffice,
      roles.gigaAdmin,
    ])
      ? PaymentStatus.Verified
      : PaymentStatus.Pending

    const { dateFrom, dateTo, metrics } = await checkAndSavePaymentMetrics(
      data.month,
      data.year,
      contract
    )

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

    if (data.invoice) {
      const invoice = await attachmentService.uploadAttachment(
        { ...data.invoice, type: AttachmentsType.INVOICE, typeId: payment.id },
        trx
      )
      payment.invoiceId = invoice.id
    }

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
  const payments = await Payment.query()
    .where('contract_id', contractId)
    .preload('currency')
    .orderBy('date_to', 'desc')

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

const changePaymentStatus = async ({ paymentId, status }: ChangePaymentStatusData) => {
  const payment = await Payment.find(paymentId)
  if (!payment) throw new NotFoundException('Payment not found', 404, 'NOT_FOUND')
  if (payment.status === PaymentStatus.Verified)
    throw new InvalidStatusException('Payment already verified', 400, 'INVALID_STATUS')
  if (payment.status === PaymentStatus.Rejected && status === PaymentStatus.Verified)
    throw new InvalidStatusException('Rejected payment cant be verified', 400, 'INVALID_STATUS')
  payment.status = status
  payment.isVerified = true
  return payment.save()
}

const updatePayment = async (data: UpdatePaymentData, user: User) => {
  const trx = await Database.transaction()
  try {
    const payment = await Payment.find(data.paymentId, { client: trx })
    if (!payment) throw new NotFoundException('Payment not found', 404, 'NOT_FOUND')

    payment.description = data.description || payment.description
    payment.amount = data.amount || payment.amount

    if (data.month && data.year) {
      const contract = await Contract.find(payment.contractId, { client: trx })
      if (!contract) throw new NotFoundException('Contract not found', 404, 'NOT_FOUND')
      const { dateFrom, dateTo, metrics } = await checkAndSavePaymentMetrics(
        data.month,
        data.year,
        contract
      )

      payment.dateFrom = dateFrom
      payment.dateTo = dateTo
      payment.metrics = metrics
    }

    if (data.invoice) {
      if (payment.invoiceId) await attachmentService.deleteAttachment(payment.invoiceId, trx)
      const invoice = await attachmentService.uploadAttachment(
        { ...data.invoice, type: AttachmentsType.INVOICE, typeId: payment.id },
        trx
      )
      payment.invoiceId = invoice.id
    }

    if (
      data.receipt &&
      userService.checkUserRole(user, [roles.government, roles.countryOffice, roles.gigaAdmin])
    ) {
      if (payment.receiptId) await attachmentService.deleteAttachment(payment.receiptId, trx)
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

    const updatedPayment = await payment.useTransaction(trx).save()
    await trx.commit()

    return updatedPayment
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

const checkAndSavePaymentMetrics = async (month: number, year: number, contract: Contract) => {
  const { dateFrom, dateTo } = utils.makeFromAndToDate(
    month,
    year,
    contract.startDate,
    contract.endDate
  )

  if (await checkPaymentInSameMonthYear(dateFrom, dateTo, contract.id)) {
    throw new AlreadyHasPaymentException(
      'Contract already has payment on that month-year',
      422,
      'ALREADY_HAS_PAYMENT'
    )
  }

  const metrics = await measureService.calculateMeasuresByMonthYear({
    contractId: contract.id,
    month: month,
    year: year,
  })
  return { dateFrom, dateTo, metrics }
}

export default {
  listFrequencies,
  createPayment,
  getPaymentsByContract,
  getPayment,
  changePaymentStatus,
  updatePayment,
}
