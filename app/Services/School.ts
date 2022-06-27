import School from 'App/Models/School'

const listSchoolByCountry = async (countryId?: number): Promise<School[]> => {
  const query = School.query()
  if (countryId) query.where('country_id', countryId)
  return query
}

export default {
  listSchoolByCountry,
}
