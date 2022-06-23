import Isp from 'App/Models/Isp'

const listIsps = async (ltaId?: number, countryId?: number): Promise<Isp[]> => {
  const query = Isp.query()
  if (countryId) query.where('country_id', countryId)
  if (ltaId) {
    query.whereHas('ltas', (qry) => {
      qry.where('lta_id', ltaId)
    })
  }
  return query
}

export default {
  listIsps,
}
