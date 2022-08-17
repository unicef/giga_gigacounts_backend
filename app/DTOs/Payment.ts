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
  }))
}

export default {
  getPaymentsByContractDTO,
}
