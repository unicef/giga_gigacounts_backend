import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import service from 'App/Services/Web3Service'

export default class DummyController {
  public async dummyCashback({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const { contract_id } = request.params()
      const result = await service.dummyCashback(contract_id)
      return response.ok(result)
    } catch (error) {
      if (!error.status) return response.internalServerError(error.message)
      return response.status(error.status).send(error.message)
    }
  }

  public async dummyAutomaticPayment({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const { contract_id } = request.params()
      const result = await service.dummyAutomaticPayment(contract_id)
      return response.ok(result)
    } catch (error) {
      if (!error.status) return response.internalServerError(error.message)
      return response.status(error.status).send(error.message)
    }
  }

  private encodeB64 = (data: string) => {
    return Buffer.from(data).toString('base64')
  }

  public async dummyEnvCheck({ response, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const result = {
        CRON_TASK_EMAIL: process.env.CRON_TASK_EMAIL || '',
        CRON_TASK_MEASURES: process.env.CRON_TASK_MEASURES || '',
        CRON_TASK_CONTRACTS_STATUS: process.env.CRON_TASK_CONTRACTS_STATUS || '',
        CRON_TASK_CASHBACK: process.env.CRON_TASK_CASHBACK || '',
        CRON_TASK_AUTOMATIC_PAYMENTS: process.env.CRON_TASK_AUTOMATIC_PAYMENTS || '',
        CRON_TASK_EMAIL_ENABLED: process.env.CRON_TASK_EMAIL_ENABLED || '',
        CRON_TASK_MEASURES_ENABLED: process.env.CRON_TASK_MEASURES_ENABLED || '',
        CRON_TASK_CONTRACTS_STATUS_ENABLED: process.env.CRON_TASK_CONTRACTS_STATUS_ENABLED || '',
        CRON_TASK_CASHBACK_ENABLED: process.env.CRON_TASK_CASHBACK_ENABLED || '',
        CRON_TASK_AUTOMATIC_PAYMENTS_ENABLED:
          process.env.CRON_TASK_AUTOMATIC_PAYMENTS_ENABLED || '',
        EMAIL_FROM: process.env.EMAIL_FROM || '',
        EMAIL_REPLY_TO: process.env.EMAIL_REPLY_TO || '',
        EMAIL_CLIENT_TO_USE: process.env.EMAIL_CLIENT_TO_USE || '',
        EMAIL_MAILJET_API_KEY: process.env.EMAIL_MAILJET_API_KEY || '',
        EMAIL_MAILJET_API_SECRET: this.encodeB64(process.env.EMAIL_MAILJET_API_SECRET || ''),
        EMAIL_MAILJET_ADDRESS_TO_FAKE: process.env.EMAIL_MAILJET_ADDRESS_TO_FAKE || '',
        EMAIL_ETHEREAL_KEY: process.env.EMAIL_ETHEREAL_KEY || '',
        EMAIL_ETHEREAL_SECRET: process.env.EMAIL_ETHEREAL_SECRET || '',
        WEB3_NETWORK_ID: process.env.WEB3_NETWORK_ID || '',
        WEB3_NODE_PROVIDER_URL: process.env.WEB3_NODE_PROVIDER_URL || '',
        WEB3_NODE_PROVIDER_KEY: this.encodeB64(process.env.WEB3_NODE_PROVIDER_KEY || ''),
        WEB3_OWNER_SK: this.encodeB64(process.env.WEB3_OWNER_SK || ''),
        AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
        AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME || ''
      }
      return response.ok(result)
    } catch (error) {
      if (!error.status) return response.internalServerError(error.message)
      return response.status(error.status).send(error.message)
    }
  }
}
