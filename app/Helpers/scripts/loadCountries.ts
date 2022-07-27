import Country from 'App/Models/Country'
import unicefApi from 'App/Helpers//unicefApi'

import utils from 'App/Helpers/utils'

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
    const result = await unicefApi.getCountries()
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
