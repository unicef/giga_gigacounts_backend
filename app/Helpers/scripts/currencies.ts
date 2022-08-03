import Currency from 'App/Models/Currency'

export const createCurrencies = () => {
  return Promise.all([
    Currency.firstOrCreate({ name: 'Brazilian Real', code: 'BRL' }),
    Currency.firstOrCreate({ name: 'US Dollar', code: 'USD' }),
  ])
}
