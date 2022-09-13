import Currency from 'App/Models/Currency'

import { CurrencyType } from 'App/Helpers/constants'
import InvalidTypeException from 'App/Exceptions/InvalidTypeException'

const listCurrencies = async (type?: CurrencyType): Promise<Currency[]> => {
  const query = Currency.query()
  if (type) {
    if (CurrencyType[type] === undefined)
      throw new InvalidTypeException('Invalid currency type', 400, 'INVALID_TYPE')
    query.where('type', CurrencyType[type])
  }
  return query
}

export default {
  listCurrencies,
}
