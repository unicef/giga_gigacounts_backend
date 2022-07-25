import Country from 'App/Models/Country'
import axios from 'App/Helpers/axios'
import { AxiosRequestHeaders } from 'axios'

import utils from 'App/Helpers/utils'

const getCountriesUrl = '/v1/countries'
const UNICEF_API = process.env.UNICEF_API || ''
const UNICEF_API_TOKEN = process.env.UNICEF_API_TOKEN || ''

const headers: AxiosRequestHeaders = {
  Authorization: `Bearer ${UNICEF_API_TOKEN}`,
}
const instance = axios.createInstance(UNICEF_API, headers)

interface UnicefCountry {
  id: number
  code: string
  name: string
  flag: string
}

const createCountry = (country: UnicefCountry) =>
  Country.firstOrCreate({ code: country.code, name: country.name, flagUrl: country.flag })

export const loadCountries = async () => {
  try {
    const result = await instance.get(getCountriesUrl)
    if (result.data?.data) {
      const chunks = utils.splitIntoChunks(result.data.data, 50) as UnicefCountry[][]
      for (const chunk of chunks) {
        await Promise.all(chunk.map((country) => createCountry(country)))
      }
    }
  } catch (error) {
    console.log(error)
  }
}
