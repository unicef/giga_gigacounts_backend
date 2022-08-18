import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service, { CreatePaymentData } from 'App/Services/Payment'

export default class PaymentsController {
  public async listFrequencies({ response }: HttpContextContract) {
    const frequencies = await service.listFrequencies()
    return response.ok(frequencies)
  }

  public async createPayment({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const data = request.all() as CreatePaymentData
      const payment = await service.createPayment(data, auth.user)
      return response.ok(payment)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
