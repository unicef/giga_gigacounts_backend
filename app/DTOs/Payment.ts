import Payment from 'App/Models/Payment'

import { PaymentStatus } from 'App/Helpers/constants'

const getPaymentsByContractDTO = (payments: Payment[]) => {
  return payments.map((payment) => ({
    paidDate: payment.dateTo?.toISODate(),
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
