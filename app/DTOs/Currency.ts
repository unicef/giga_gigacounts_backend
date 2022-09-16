import Currency from 'App/Models/Currency'
import { CurrencyType } from 'App/Helpers/constants'

export interface CurrencyData {
  id: string
  name: string
  type: string
  code: string
}

const listCurrenciesDTO = (currencies: Currency[]): CurrencyData[] => {
  return currencies.map((currency) => ({
    id: currency.id.toString(),
    name: currency.name,
    code: currency.code,
    type: CurrencyType[currency.type],
  }))
}

export default {
  listCurrenciesDTO,
}
