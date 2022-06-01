import School from 'App/Models/School'

const listSchoolByCountry = async (countryId: number): Promise<School[]> => {
  return School.query().where('country_id', countryId)
}

export default {
  listSchoolByCountry,
}
