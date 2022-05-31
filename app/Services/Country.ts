import Country from 'App/Models/Country'

const listCountries = async (): Promise<Country[]> => {
  return Country.all()
}

export default {
  listCountries,
}
