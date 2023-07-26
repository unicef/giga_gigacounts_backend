import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service, {
  CreatePaymentData,
  ChangePaymentStatusData,
  UpdatePaymentData
} from 'App/Services/Payment'

export default class PaymentsController {
  public async listFrequencies({ response }: HttpContextContract) {
    const frequencies = await service.listFrequencies()
    return response.ok(frequencies)
  }

  public async getPayments({ response, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const payments = await service.getPayments(auth.user)
      return response.ok(payments)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async getPaymentsByContract({ response, request }: HttpContextContract) {
    try {
      const { contract_id } = request.params()
      const payments = await service.getPaymentsByContract(contract_id)
      return response.ok(payments)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
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

  public async getPayment({ response, request }: HttpContextContract) {
    try {
      const { payment_id } = request.params()
      const payment = await service.getPayment(payment_id)
      return response.ok(payment)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async changePaymentStatus({ response, request }: HttpContextContract) {
    try {
      const data = request.all() as ChangePaymentStatusData
      const payment = await service.changePaymentStatus(data)
      return response.ok(payment)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async updatePayment({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const data = request.body() as UpdatePaymentData
      const payment = await service.updatePayment(data, auth.user)
      return response.ok(payment)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
