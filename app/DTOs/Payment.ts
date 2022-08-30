import Payment from 'App/Models/Payment'

import { PaymentStatus } from 'App/Helpers/constants'
import Currency from 'App/Models/Currency'
import Attachment from 'App/Models/Attachment'

export interface PaymentsByContract {
  id: number
  paidDate: string
  description?: string
  currency: Currency
  amount: number
  status: string
  metrics?: {
    withoutConnection: number
    atLeastOneBellowAvg: number
    allEqualOrAboveAvg: number
  }
  invoice?: Attachment
  receipt?: Attachment
  createdBy?: {
    name: string
    role: string
  }
}

export interface GetPayment {
  id: number
  description?: string
  paidDate: {
    month?: number
    year?: number
  }
  currency: Currency
  amount: number
  status: string
  metrics?: {
    withoutConnection: number
    atLeastOneBellowAvg: number
    allEqualOrAboveAvg: number
  }
  invoice?: Attachment
  receipt?: Attachment
  createdBy?: {
    name: string
    role: string
  }
}

const getPaymentsByContractDTO = (payments: Payment[]): PaymentsByContract[] => {
  return payments.map((payment) => ({
    id: payment.id,
    paidDate: payment.dateTo?.toISODate() || '',
    description: payment.description,
    currency: payment.currency,
    amount: payment.amount,
    status: PaymentStatus[payment.status],
    metrics: payment?.metrics,
    invoice: payment?.invoice,
    receipt: payment?.receipt,
    createdBy: {
      name: payment?.creator?.name,
      role: payment?.creator?.roles[0]?.name,
    },
  }))
}

const getPaymentDTO = (payment: Payment): GetPayment => ({
  id: payment.id,
  description: payment.description,
  paidDate: {
    month: payment.dateTo?.get('month'),
    year: payment.dateTo?.get('year'),
  },
  currency: payment.currency,
  amount: payment.amount,
  status: PaymentStatus[payment.status],
  metrics: payment?.metrics,
  invoice: payment?.invoice,
  receipt: payment?.receipt,
  createdBy: {
    name: payment?.creator?.name,
    role: payment?.creator?.roles[0]?.name,
  },
})

export default {
  getPaymentsByContractDTO,
  getPaymentDTO,
}
