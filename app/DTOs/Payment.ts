import Payment from 'App/Models/Payment'

import { ContractStatus, PaymentStatus, frequencyNames } from 'App/Helpers/constants'
import Currency from 'App/Models/Currency'
import Attachment from 'App/Models/Attachment'
import { ConnectionMedian } from './Contract'

export interface GetPayment {
  id: number
  contractId?: number
  contractName?: string
  contractCountryName?: string
  contractStatus?: string
  contractFrequency?: string
  contractAutomatic?: boolean
  description?: string
  dateFrom?: string | null
  dateTo?: string | null
  paidDate: {
    day?: number | null
    month?: number
    year?: number
  }
  currency: Currency
  amount: number
  discount: number
  status: string
  metrics?: {
    connectionsMedian: ConnectionMedian[]
    withoutConnection: number
    atLeastOneBellowAvg: number
    allEqualOrAboveAvg: number
  }
  invoice?: Attachment
  receipt?: Attachment
  createdBy?: {
    name: string
    role: string
    id: number
  }
  contractNumberOfSchools?: number
}

const getPaymentDTO = (payment: Payment): GetPayment => {
  const isMonthly = payment.contract.frequency.name === frequencyNames.Monthly

  return {
    id: payment.id,
    description: payment.description,
    paidDate: {
      day: isMonthly ? null : payment.dateTo?.get('day'),
      month: payment.dateTo?.get('month'),
      year: payment.dateTo?.get('year')
    },
    dateFrom: payment.dateFrom?.toISODate(),
    dateTo: payment.dateTo?.toISODate(),
    currency: payment.currency,
    amount: payment.amount,
    discount: payment.discount,
    status: PaymentStatus[payment.status],
    metrics: payment?.metrics,
    invoice: payment?.invoice,
    receipt: payment?.receipt,
    createdBy: {
      name: payment?.creator?.name,
      role: payment?.creator?.roles[0]?.name,
      id: payment?.creator?.id
    }
  }
}

const getPaymentWithDetailsDTO = (payment: Payment): GetPayment => {
  const isMonthly = payment.contract.frequency.name === frequencyNames.Monthly

  return {
    id: payment.id,
    contractId: payment.contractId,
    contractName: payment.contract.name || '',
    contractCountryName: payment.contract.country.name || '',
    contractStatus: ContractStatus[payment.contract.status],
    contractFrequency: payment.contract.frequency.name,
    contractAutomatic: payment.contract.automatic,
    description: payment.description,
    paidDate: {
      day: isMonthly ? null : payment.dateTo?.get('day'),
      month: payment.dateTo?.get('month'),
      year: payment.dateTo?.get('year')
    },
    dateFrom: payment.dateFrom?.toISODate(),
    dateTo: payment.dateTo?.toISODate(),
    currency: payment.currency,
    amount: payment.amount,
    discount: payment.discount,
    status: PaymentStatus[payment.status],
    metrics: payment?.metrics,
    invoice: payment?.invoice,
    receipt: payment?.receipt,
    createdBy: {
      name: payment?.creator?.name,
      role: payment?.creator?.roles[0]?.name,
      id: payment?.creator?.id
    },
    contractNumberOfSchools: payment.contract.schools.length
  }
}

const getPaymentsByContractDTO = (payments: Payment[]): GetPayment[] => {
  return payments.map(getPaymentDTO)
}

const getPaymentsWithDetailsDTO = (payments: Payment[]): GetPayment[] => {
  return payments.map(getPaymentWithDetailsDTO)
}

export default {
  getPaymentsByContractDTO,
  getPaymentsWithDetailsDTO,
  getPaymentDTO
}
