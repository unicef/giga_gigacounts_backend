import Currency from 'App/Models/Currency'
import { CurrenncyType } from 'App/Helpers/constants'

export const createCurrencies = () => {
  return Promise.all([
    Currency.firstOrCreate({ name: 'Brazilian Real', code: 'BRL', type: CurrenncyType.Fiat }),
    Currency.firstOrCreate({ name: 'US Dollar', code: 'USD', type: CurrenncyType.Fiat }),
    Currency.firstOrCreate({ name: 'Ether', code: 'ETH', type: CurrenncyType.Crypto }),
  ])
}
