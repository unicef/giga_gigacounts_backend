import Lta from 'App/Models/Lta'

const listLtas = async (countryId?: number): Promise<Lta[]> => {
  const query = Lta.query()
  if (countryId) query.where('country_id', countryId)
  return query
}

export default {
  listLtas,
}
