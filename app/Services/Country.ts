import Country from 'App/Models/Country'
import userService from 'App/Services/User'
import User from 'App/Models/User'

import { roles } from 'App/Helpers/constants'

const listCountries = async (user: User): Promise<Country[]> => {
  const query = Country.query()
  if (userService.checkUserRole(user, [roles.countryOffice, roles.government])) {
    query.where('id', user.countryId)
  }
  return query.orderBy('name', 'asc')
}

export default {
  listCountries,
}
