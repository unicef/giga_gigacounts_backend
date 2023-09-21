import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon/src/luxon'

import DatabaseException from 'App/Exceptions/DatabaseException'
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
import { PaymentStatus, roles, ContractStatus, NotificationSources } from 'App/Helpers/constants'
import NotificationsService from 'App/Services/Notifications'

import dto from 'App/DTOs/Payment'
import contractDTO from 'App/DTOs/Contract'

import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Measure from 'App/Models/Measure'

interface File {
  file: string
  name: string
}

export interface CreatePaymentData {
  day?: number
  month: number
  year: number
  description?: string
  amount: number
  status?: PaymentStatus
  invoice?: File
  receipt?: File
  contractId: string
  discount?: number
  isVerified?: boolean
  dateFrom?: string
  dateTo?: string
}

export interface ChangePaymentStatusData {
  paymentId: number
  status: string
}

export interface UpdatePaymentData {
  paymentId: string
  description?: string
  day?: number
  month?: number
  year?: number
  amount?: number
  invoice?: File
  receipt?: File
  status?: PaymentStatus
  dateFrom?: DateTime
  dateTo?: DateTime
}

export interface PaymentMeasures {
  day?: number
  month: number
  year: number
  contractId: number
}

export interface SchoolConnectionInfo {
  value: number
  days: number
}

export interface ConnectionStatus {
  goodConnection: number;
  badConnection: number;
  noConnection: number;
  unknownConnection: number;
}

export interface ConnectionInfo {
  schoolsConnected: ConnectionStatus;
  daysConnected: ConnectionStatus;
}


const listFrequencies = async (): Promise<Frequency[]> => {
  return Frequency.all()
}

const createPayment = async (data: CreatePaymentData, user: User) => {
  const trx = await Database.transaction()
  try {
    const contract = await Contract.find(data.contractId, { client: trx })
    if (!contract) throw new NotFoundException('Contract not found')
    if (contract.status === ContractStatus.Completed)
      throw new InvalidStatusException('Invalid status', 400, 'INVALID_STATUS')

    let status
    if (data.status) {
      status = data.status
    } else {
      status = PaymentStatus.Draft
    }

    await contract.load('frequency')
    const { dateFrom, dateTo, metrics } = await checkAndSavePaymentMetrics(
      contract.frequency.name,
      data.month,
      data.year,
      contract,
      data.day
    )

    const payment = await Payment.create(
      {
        /* for automatic payments creation, the dateFrom and dateTo is provided in 'data' variable! */
        dateFrom: data.dateFrom
          ? utils.setDateToBeginOfDayFromISO(
              utils.GetDateTimeFromFormat('yyyyMMddHHmmss', data.dateFrom)
            )
          : dateFrom,
        dateTo: data.dateTo
          ? utils.setDateToBeginOfDayFromISO(
              utils.GetDateTimeFromFormat('yyyyMMddHHmmss', data.dateTo)
            )
          : dateTo,
        contractId: contract.id,
        amount: data.amount,
        discount: data.discount || 0,
        currencyId: contract.currencyId,
        description: data.description,
        status: status,
        createdBy: user.id,
        metrics: metrics,
        isVerified: data.isVerified || false
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
          typeId: payment.id
        },
        trx
      )
      payment.receiptId = receipt.id
    }

    await payment.useTransaction(trx).save()
    await trx.commit()

    await payment.load('currency')
    await payment.load('creator')
    await payment.creator.load('roles')
    await payment.load('contract')
    await payment.contract.load('frequency')
    if (payment.invoiceId) await payment.load('invoice')
    if (payment.receiptId) await payment.load('receipt')

    NotificationsService.createNotificationByOperation(
      contract.automatic
        ? NotificationSources.automaticPaymentCreated
        : NotificationSources.manualPaymentCreated,
      contract.id?.toString() || '0',
      false
    )

    return dto.getPaymentDTO(payment)
  } catch (error) {
    await trx.rollback()
    if ([404, 422, 400, 413].some((status) => status === error?.status)) throw error
    throw new DatabaseException(
      'Some database error occurred creating payment. Detail: ' + error.message
    )
  }
}

const checkPaymentInSamePeriod = async (
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
  if (!contract) throw new NotFoundException('Contract not found')
  const payments = await Payment.query()
    .where('contract_id', contractId)
    .preload('currency')
    .preload('creator', (builder) => builder.preload('roles'))
    .preload('contract', (builder) => builder.preload('frequency'))
    .orderBy('date_to', 'desc')

  await Promise.all(
    payments.map(async (payment) => {
      if (payment.invoiceId) await payment.load('invoice')
      if (payment.receiptId) await payment.load('receipt')
    })
  )
  return dto.getPaymentsByContractDTO(payments)
}

const getSchoolMeasures = async(contract: Contract, dateFrom: Date, dateTo: Date) => {
  const schoolsMeasures = {}
  const connectionList: SchoolConnectionInfo[] = [];
  const formattedDateFrom = dateFrom.toISOString();
  const formattedDateTo = dateTo.toISOString();
  if (contract.schools?.length) {
    schoolsMeasures[contract.name] = {}

    for (const school of contract.schools) {
      schoolsMeasures[contract.name][school.name] = await Measure.query()
        .avg('value')
        .where('school_id', school.id)
        .andWhere('contract_id', contract.id)
        .whereBetween('created_at', [formattedDateFrom, formattedDateTo])
        .select('metric_id')
        .groupBy('metric_id')

      const connection = await contractDTO.calculateSchoolsMeasure(
        schoolsMeasures[contract.name][school.name],
        contract.expectedMetrics
      )

      const recordCountResult = await Measure.query()
        .where('school_id', school.id)
        .andWhere('contract_id', contract.id)
        .whereBetween('created_at', [formattedDateFrom, formattedDateTo])
        .countDistinct('created_at as count');
    
      const occurrences = parseInt(recordCountResult[0].$extras.count) || -1;
      connectionList.push({value: connection.value, days: occurrences})
    }
  }

  return connectionList
}

const getPercentages = async(dateFrom: Date, dateTo: Date, connection: SchoolConnectionInfo[]) => {
  const differenceInMilliseconds = Math.abs(dateTo.getTime() - dateFrom.getTime());

  const days = Math.round(differenceInMilliseconds / (1000 * 60 * 60 * 24)) | 0

  const valuesConnectionStatus: ConnectionStatus = {
    goodConnection: 0,
    badConnection: 0,
    noConnection: 0,
    unknownConnection: 0,
  };

  const daysConnectionStatus: ConnectionStatus = {
      goodConnection: 0,
      badConnection: 0,
      noConnection: 0,
      unknownConnection: 0,
  };  

  for (const item of connection) {
    if (item.value >= 100) {
        valuesConnectionStatus.goodConnection++;
    } else if (item.value > 0 && item.value < 100) {
        valuesConnectionStatus.badConnection++;
    } else if (item.value === 0) {
        valuesConnectionStatus.noConnection++;
    } else if (item.value === -1) {
        valuesConnectionStatus.unknownConnection++;
    }

    if (item.days >= days) {
        daysConnectionStatus.goodConnection++;
    } else if (item.days > 0 && item.days < days) {
        daysConnectionStatus.badConnection++;
    } else if (item.days === 0) {
        daysConnectionStatus.noConnection++;
    } else if (item.days === -1) {
        daysConnectionStatus.unknownConnection++;
    }
  }
  
  const calculatePercentage = (count: number) => (count / connection.length) * 100

  const connectionInfo: ConnectionInfo = {
    schoolsConnected: {
        ...valuesConnectionStatus,
        goodConnection: calculatePercentage(valuesConnectionStatus.goodConnection) | 0,
        badConnection: calculatePercentage(valuesConnectionStatus.badConnection) |0 ,
        noConnection: calculatePercentage(valuesConnectionStatus.noConnection) | 0,
        unknownConnection: calculatePercentage(valuesConnectionStatus.unknownConnection) | 0,
    },
    daysConnected: {
        ...daysConnectionStatus,
        goodConnection: calculatePercentage(daysConnectionStatus.goodConnection) | 0,
        badConnection: calculatePercentage(daysConnectionStatus.badConnection) | 0,
        noConnection: calculatePercentage(daysConnectionStatus.noConnection) | 0 ,
        unknownConnection: calculatePercentage(daysConnectionStatus.unknownConnection) | 0
    },
  };

  return connectionInfo
}

const queryBuilder = async (
  user: User,
  countryId?: number
): Promise<{ query: ModelQueryBuilderContract<typeof Payment, Payment> }> => {
  let query = Payment.query()
  const isAdmin = await userService.checkUserRole(user, [roles.gigaAdmin, roles.gigaViewOnly])

  if (isAdmin) {
    if (countryId) {
      query.whereHas('contract', (builder) => {
        builder.where('countryId', countryId)
      })
    }
  } else {
    query.whereHas('contract', (builder) => {
      builder.where('countryId', user.countryId)
    })
  }

  return { query }
}

const fetchPaymentsList = async (query: ModelQueryBuilderContract<typeof Payment, Payment>) => {
  return query
    .preload('currency')
    .preload('creator', (builder) => builder.preload('roles'))
    .preload('contract', (builder) => {
      builder.preload('country')
      builder.preload('frequency')
      builder.preload('schools')
    })
    .orderBy('date_to', 'desc')
}

const getPayments = async (user: User, countryId?: number) => {
  const { query } = await queryBuilder(user, countryId)
  let payments: Payment[] = []

  payments = await fetchPaymentsList(query)
  await Promise.all(
    payments.map(async (payment) => {
      if (payment.invoiceId) await payment.load('invoice')
      if (payment.receiptId) await payment.load('receipt')
    })
  )

  return dto.getPaymentsWithDetailsDTO(payments)
}

const getPayment = async (paymentId: string) => {
  const payment = await Payment.find(paymentId)
  if (!payment) throw new NotFoundException('Payment not found')
  await payment.load('currency')
  await payment.load('creator')
  await payment.creator.load('roles')
  await payment.load('contract')
  await payment.contract.load('frequency')
  if (payment.invoiceId) await payment.load('invoice')
  if (payment.receiptId) await payment.load('receipt')
  return dto.getPaymentDTO(payment)
}

const getPaymentMeasures = async (data: PaymentMeasures) => {
  const contract = await Contract.query()
    .where('id', data.contractId)
    .preload('frequency')
    .preload('expectedMetrics')
    .preload('schools')
    .withCount('schools')

  if (!contract) throw new NotFoundException('Contract not found')

  const { dateFrom, dateTo } = utils.makeFromAndToDate(
    contract[0].frequency.name,
    data.month,
    data.year,
    contract[0].endDate,
    contract[0].startDate,
    data.day
  )

  const connectionValues = await getSchoolMeasures(contract[0], new Date(dateFrom), new Date(dateTo))
  const percentages = await getPercentages(new Date(dateFrom), new Date(dateTo), connectionValues)
  return percentages
}

const changePaymentStatus = async ({ paymentId, status }: ChangePaymentStatusData) => {
  const payment = await Payment.find(paymentId)
  if (!payment) throw new NotFoundException('Payment not found')

  if (payment.status === PaymentStatus.Paid)
    throw new InvalidStatusException('Payment already made', 400, 'INVALID_STATUS')

  payment.status = PaymentStatus[status]
  payment.isVerified = true

  if (payment.status === PaymentStatus.Paid) {
    NotificationsService.createNotificationByOperation(
      NotificationSources.manualPaymentAccepted,
      payment.contractId.toString() || '0',
      false
    )
  }

  await payment.save()
  await payment.load('currency')
  await payment.load('creator')
  await payment.creator.load('roles')
  await payment.load('contract')
  await payment.contract.load('frequency')
  if (payment.invoiceId) await payment.load('invoice')
  if (payment.receiptId) await payment.load('receipt')

  return dto.getPaymentDTO(payment)
}

const updatePayment = async (data: UpdatePaymentData, user: User) => {
  const trx = await Database.transaction()
  try {
    const payment = await Payment.find(data.paymentId, { client: trx })
    if (!payment) throw new NotFoundException('Payment not found')

    if (payment.status === PaymentStatus.Paid) {
      throw new InvalidStatusException(
        'ISPs cant update a paid payment',
        401,
        'E_UNAUTHORIZED_ACCESS'
      )
    }

    const contract = await Contract.find(payment.contractId, { client: trx })
    if (!contract) throw new NotFoundException('Contract not found')
    if (contract.status === ContractStatus.Completed) {
      throw new InvalidStatusException('Contract already completed', 400, 'INVALID_STATUS')
    }

    payment.description = data.description || payment.description
    payment.amount = data.amount || payment.amount

    await contract.load('frequency')
    if (data.month && data.year) {
      const { dateFrom, dateTo, metrics } = await checkAndSavePaymentMetrics(
        contract.frequency.name,
        data.month,
        data.year,
        contract,
        data.day
      )
      payment.dateFrom = data.dateFrom ?? dateFrom
      payment.dateTo = data.dateTo ?? dateTo
      payment.metrics = metrics
    }

    if (data.invoice) {
      if (payment.invoiceId) await attachmentService.deleteAttachment(payment.invoiceId, user, trx)
      const invoice = await attachmentService.uploadAttachment(
        { ...data.invoice, type: AttachmentsType.INVOICE, typeId: payment.id },
        trx
      )
      payment.invoiceId = invoice.id
    }

    if (
      data.receipt &&
      (await userService.checkUserRole(user, [
        roles.gigaAdmin,
        roles.countryContractCreator,
        roles.countryAccountant,
        roles.countrySuperAdmin
      ]))
    ) {
      if (payment.receiptId) await attachmentService.deleteAttachment(payment.receiptId, user, trx)
      const receipt = await attachmentService.uploadAttachment(
        {
          ...data.receipt,
          type: AttachmentsType.RECEIPT,
          typeId: payment.id
        },
        trx
      )
      payment.receiptId = receipt.id
    }

    if (data.status) {
      payment.status = data.status
    } else {
      payment.status = PaymentStatus.Draft
    }

    const updatedPayment = await payment.useTransaction(trx).save()
    await trx.commit()

    await updatedPayment.load('currency')
    await updatedPayment.load('creator')
    await updatedPayment.creator.load('roles')
    await updatedPayment.load('contract')
    await updatedPayment.contract.load('frequency')
    if (updatedPayment.invoiceId) await updatedPayment.load('invoice')
    if (updatedPayment.receiptId) await updatedPayment.load('receipt')

    return dto.getPaymentDTO(updatedPayment)
  } catch (error) {
    await trx.rollback()
    if ([404, 422, 400, 413, 401].some((status) => status === error?.status)) throw error
    throw new DatabaseException('Some database error occurred getting payment DTO')
  }
}

const checkAndSavePaymentMetrics = async (
  frecuency: string,
  month: number,
  year: number,
  contract: Contract,
  day?: number
) => {
  const { dateFrom, dateTo } = utils.makeFromAndToDate(
    frecuency,
    month,
    year,
    contract.endDate,
    contract.launchDate,
    day
  )

  if (await checkPaymentInSamePeriod(dateFrom, dateTo, contract.id)) {
    throw new AlreadyHasPaymentException(
      'Contract already has payment on this period of time.',
      422,
      'ALREADY_HAS_PAYMENT'
    )
  }

  const metrics = await measureService.calculateMeasuresByMonthYear({
    contractId: contract.id,
    month: month,
    year: year
  })
  return { dateFrom, dateTo, metrics }
}

const checkPaymentFileEdit = async (
  paymentId: number,
  userId: number,
  trx: TransactionClientContract
) => {
  const user = await User.query().useTransaction(trx).where('id', userId).preload('roles')
  if (
    await userService.checkUserRole(user[0], [roles.ispContractManager, roles.ispCustomerService])
  ) {
    const payment = await Payment.find(paymentId, { client: trx })
    if (payment?.status === PaymentStatus.Unpaid) {
      payment.status = PaymentStatus.Draft
      await payment.useTransaction(trx).save()
    }
  }
}

export default {
  listFrequencies,
  createPayment,
  getPayments,
  getPaymentsByContract,
  getPayment,
  getPaymentMeasures,
  changePaymentStatus,
  updatePayment,
  checkPaymentFileEdit
}
