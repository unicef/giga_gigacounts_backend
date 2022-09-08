import Currency from 'App/Models/Currency'

const listCurrencies = async (type?: number): Promise<Currency[]> => {
  const query = Currency.query()
  if (type) query.where('type', type)
  return query
}

export default {
  listCurrencies,
}
