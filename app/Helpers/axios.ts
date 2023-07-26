import axios, { AxiosRequestHeaders } from 'axios'

const createInstance = (baseUrl: string, headers: AxiosRequestHeaders) => {
  return axios.create({
    baseURL: baseUrl,
    headers
  })
}

export default {
  createInstance
}
