import fs from 'fs/promises'
import nock from 'nock'
import { ApiClient } from '@japa/api-client'

import Attachment from 'App/Models/Attachment'
import User from 'App/Models/User'

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

export default {
  toBase64,
  mockUnicefAllMeasurements,
  checkAllMocksCalled,
  cleanAllMocks,
  createAttachment,
}
