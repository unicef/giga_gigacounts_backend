import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import utils from 'App/Helpers/utils'

import service, {
  CreatePaymentData,
  ChangePaymentStatusData,
  UpdatePaymentData,
  PaymentMeasures
} from 'App/Services/PaymentService'

export default class PaymentsController {
  public async listFrequencies({ response }: HttpContextContract) {
    const frequencies = await service.listFrequencies()
    return response.ok(frequencies)
  }

  public async getPayments({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return

      const { countryId, dateFrom, dateTo } = request.qs()
      const { startDate, endDate } = utils.calculateDatesRange(30, dateFrom, dateTo)

      const payments = await service.getPayments(
        auth.user,
        startDate,
        endDate,
        countryId || auth.user.countryId
      )
      return response.ok(payments)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async getPaymentMeasures({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return

      const data = request.body() as PaymentMeasures
      const measures = await service.getPaymentMeasures(data)
      return response.ok(measures)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async getPaymentsByContract({ response, request }: HttpContextContract) {
    try {
      const { contract_id, dateFrom, dateTo } = request.params()
      const { startDate, endDate } = utils.calculateDatesRange(30, dateFrom, dateTo)

      const payments = await service.getPaymentsByContract(contract_id, startDate, endDate)
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
