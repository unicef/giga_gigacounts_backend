import fs from 'fs/promises'
import nock from 'nock'
import { ApiClient } from '@japa/api-client'

import Attachment from 'App/Models/Attachment'
import User from 'App/Models/User'
import { CreatePaymentData, UpdatePaymentData } from 'App/Services/Payment'
import Payment from 'App/Models/Payment'

const UNICEF_API = process.env.UNICEF_API || ''

const lower20Pdf = `${__dirname}/lower_20.pdf`

const toBase64 = async (data: string, filePath: string = lower20Pdf) => {
  const base64 = await fs.readFile(filePath, { encoding: 'base64' })
  return `${data}${base64}`
}

const mockUnicefAllMeasurements = async (countryCode: string, responseBody: Object) => {
  return nock(UNICEF_API)
    .get(`/v1/all_measurements/${countryCode}`)
    .reply(200, () => {
      return responseBody
    })
}

const checkAllMocksCalled = () => {
  if (!nock.isDone()) return false
  return true
}

const cleanAllMocks = () => nock.cleanAll()

const createAttachment = async (client: ApiClient, user: User, typeId: number) => {
  const file = await toBase64('data:application/pdf;base64,', lower20Pdf)
  const response = await client
    .post('/attachments/upload')
    .loginAs(user)
    .json({ file, type: 'draft', typeId, name: 'fake name' })
  const attachment = response.body() as Attachment
  return attachment
}

const createPayments = async (client: ApiClient, user: User, body: CreatePaymentData) => {
  const response = await client.post('/payment').loginAs(user).json(body)
  const payment = response.body() as Payment
  return payment
}

const buildCreatePaymentBody = async (
  month: number,
  year: number,
  contractId: string,
  currencyId: string,
  hasReceipt: boolean = false
): Promise<CreatePaymentData> => ({
  description: 'payment description',
  month,
  year,
  amount: 100000,
  invoice: {
    file: await toBase64('data:application/pdf;base64,'),
    name: 'File',
  },
  contractId,
  currencyId,
  ...(hasReceipt && {
    receipt: { file: await toBase64('data:application/pdf;base64,'), name: 'Receipt' },
  }),
})

const buildUpdatePaymentBody = async (
  paymentId: string,
  month?: number,
  year?: number,
  amount?: number,
  description: boolean = false,
  hasAttachments: boolean = false
): Promise<UpdatePaymentData> => ({
  paymentId,
  ...(description && { description: 'payment description updated' }),
  month,
  year,
  amount,
  ...(hasAttachments && {
    invoice: {
      file: await toBase64('data:application/pdf;base64,'),
      name: 'File updated',
    },
  }),
  ...(hasAttachments && {
    receipt: { file: await toBase64('data:application/pdf;base64,'), name: 'Receipt updated' },
  }),
})

export default {
  toBase64,
  mockUnicefAllMeasurements,
  checkAllMocksCalled,
  cleanAllMocks,
  createAttachment,
  createPayments,
  buildCreatePaymentBody,
  buildUpdatePaymentBody,
}
