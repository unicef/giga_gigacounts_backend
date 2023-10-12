import axios from 'App/Helpers/axios'
import { AxiosRequestHeaders } from 'axios'

const UNICEF_API = process.env.UNICEF_API || ''
const UNICEF_API_TOKEN = process.env.UNICEF_API_TOKEN || ''

const headers: AxiosRequestHeaders = {
  Authorization: `Bearer ${UNICEF_API_TOKEN}`
}

const instance = axios.createInstance(UNICEF_API, headers)

export interface MeasurementsBySchoolData {
  country_code: string
  school_id: string
  start_date?: string
  end_date?: string
  size: number
}

export interface MeasurementsData {
  download: number
  upload: number
  latency: string
  timestamp: string
}

const allMeasurementsBySchool = async (
  data: MeasurementsBySchoolData
): Promise<MeasurementsData[]> => {
  const condition = true
  const measures: MeasurementsData[] = []
  let page = 0
  while (condition) {
    page++
    const result = await instance.get(`/all_measurements/${data.country_code}`, {
      params: {
        page,
        size: data.size,
        school_id: data.school_id,
        start_date: data.start_date,
        end_date: data.end_date
      }
    })
    if (result.data?.data?.length > 0) {
      await Promise.all(
        result.data.data.map((measure: MeasurementsData) => {
          measures.push({
            download: measure['connectivity_speed'],
            upload: 0,
            latency: measure['connectivity_latency'],
            timestamp: measure['date']
          })
        })
      )
    } else {
      break
    }
  }

  return measures
}

const getCountries = async () => instance.get('/countries')

const getSchools = async (countryId: number, page: number, size: number) =>
  instance.get(`/schools/country/${countryId}`, { params: { page, size } })

export default {
  allMeasurementsBySchool,
  getCountries,
  getSchools
}
