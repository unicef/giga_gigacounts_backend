import Currency from 'App/Models/Currency'

const listCurrencies = async (): Promise<Currency[]> => {
  return Currency.all()
}

export default {
  listCurrencies,
}
