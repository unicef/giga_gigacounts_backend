import Country from 'App/Models/Country'
import userService from 'App/Services/UserService'
import User from 'App/Models/User'
import { roles } from 'App/Helpers/constants'
import dto, { CountryData } from 'App/DTOs/Country'

const listCountries = async (user: User): Promise<CountryData[]> => {
  const query = Country.query()
  if (
    await userService.checkUserRole(user, [
      roles.countryContractCreator,
      roles.countryAccountant,
      roles.countrySuperAdmin,
      roles.countryMonitor
    ])
  ) {
    query.where('id', user.countryId)
  }

  const countries = (await query) as Country[]
  return dto.listCountriesDTO(countries)
}

export default {
  listCountries
}
