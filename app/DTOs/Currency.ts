import Currency from 'App/Models/Currency'
import { CurrencyType } from 'App/Helpers/constants'

export interface CurrencyData {
  id: string
  code: string
  name: string
  type: string
  contractAddress: string
  networkId: number
  countries: {
    id: number
    code: string
    name: string
  }[]
}

const listCurrenciesDTO = async (currencies: Currency[]): Promise<CurrencyData[]> => {
  return Promise.all(
    currencies.map(async (currency) => {
      const countries = await currency.related('countries').query()
      const mappedCountries = countries.map((country) => ({
        id: country.id,
        code: country.code,
        name: country.name
      }))

      return {
        id: currency.id.toString(),
        code: currency.code,
        name: currency.name,
        type: CurrencyType[currency.type],
        contractAddress: currency.contractAddress,
        networkId: currency.networkId,
        countries: mappedCountries
      }
    })
  )
}
/*
  return currencies.map((currency) => ({
    id: currency.id.toString(),
    code: currency.code,
    name: currency.name,
    type: CurrencyType[currency.type],
    contractAddress: currency.contractAddress,
    networkId: currency.networkId,
    countries: Promise.all( 
      currency.countries.map(async (country) => {
        return {
          id: country.id,
          code: country.code,
          name: country.name
        }
      })
    )
  }))
}
*/

export default {
  listCurrenciesDTO
}
