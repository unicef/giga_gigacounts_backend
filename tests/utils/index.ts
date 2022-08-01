import fs from 'fs/promises'
import nock from 'nock'

const UNICEF_API = process.env.UNICEF_API || ''

const toBase64 = async (data: string, filePath: string) => {
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

export default {
  toBase64,
  mockUnicefAllMeasurements,
  checkAllMocksCalled,
  cleanAllMocks,
}
