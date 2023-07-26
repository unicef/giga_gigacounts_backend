import Currency from 'App/Models/Currency'

import { CurrencyType } from 'App/Helpers/constants'
import InvalidTypeException from 'App/Exceptions/InvalidTypeException'
import dto, { CurrencyData } from 'App/DTOs/Currency'

const listCurrencies = async (
  type?: CurrencyType,
  networkId?: number,
  countryId?: number
): Promise<CurrencyData[]> => {
  const query = Currency.query().where('enabled', true)

  if (type) {
    if (CurrencyType[type] === undefined)
      throw new InvalidTypeException('Invalid currency type', 400, 'INVALID_TYPE')
    query.andWhere('type', CurrencyType[type])
  }
  if (networkId) {
    query.andWhere('networkId', networkId)
  }

  if (countryId && type && type.toString().toLocaleLowerCase() === 'fiat') {
    query.whereHas('countries', (builder) => {
      builder.where('country_id', countryId)
    })
  }

  const currencies = (await query) as Currency[]
  return dto.listCurrenciesDTO(currencies)
}

export default {
  listCurrencies
}
