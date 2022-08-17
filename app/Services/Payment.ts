import Frequency from 'App/Models/Frequency'
import Payment from 'App/Models/Payment'
import Contract from 'App/Models/Contract'

import NotFoundException from 'App/Exceptions/NotFoundException'

import dto from 'App/DTOs/Payment'

const listFrequencies = async (): Promise<Frequency[]> => {
  return Frequency.all()
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

export default {
  listFrequencies,
  getPaymentsByContract,
}
