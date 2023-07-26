import { CurrencyType } from 'App/Helpers/constants'
import Country from 'App/Models/Country'

export interface CountryData {
  id: string
  code: string
  name: string
  flag_url: string
  preferred_language: string
  currencies: {
    id: number
    code: string
    name: string
    type: CurrencyType
    contractAddress?: string
    networkId?: number
  }[]
}

const listCountriesDTO = async (countries: Country[]): Promise<CountryData[]> => {
  return Promise.all(
    countries.map(async (country) => {
      const currencies = await country.related('currencies').query()
      const mappedCurrencies = currencies.map((currency) => ({
        id: currency.id,
        code: currency.code,
        name: currency.name,
        type: currency.type,
        contractAddress: currency.contractAddress,
        networkId: currency.networkId
      }))

      return {
        id: country.id.toString(),
        code: country.code,
        name: country.name,
        flag_url: country.flagUrl,
        preferred_language: country.preferredLanguage,
        currencies: mappedCurrencies
      }
    })
  )
}

export default {
  listCountriesDTO
}
