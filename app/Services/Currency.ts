import Currency from 'App/Models/Currency'

import { CurrencyType } from 'App/Helpers/constants'
import InvalidTypeException from 'App/Exceptions/InvalidTypeException'
import dto, { CurrencyData } from 'App/DTOs/Currency'

const listCurrencies = async (type?: CurrencyType): Promise<CurrencyData[]> => {
  const query = Currency.query()
  if (type) {
    if (CurrencyType[type] === undefined)
      throw new InvalidTypeException('Invalid currency type', 400, 'INVALID_TYPE')
    query.where('type', CurrencyType[type])
  }
  const currencies = await query

  return dto.listCurrenciesDTO(currencies)
}

export default {
  listCurrencies,
}
