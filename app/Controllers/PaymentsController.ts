import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Payment'

export default class PaymentsController {
  public async listFrequencies({ response }: HttpContextContract) {
    const frequencies = await service.listFrequencies()
    return response.ok(frequencies)
  }

  public async getPaymentsByContract({ response, request }: HttpContextContract) {
    const { contract_id } = request.params()
    const payments = await service.getPaymentsByContract(contract_id)
    return response.ok(payments)
  }
}
