import Lta from 'App/Models/Lta'
import User from 'App/Models/User'

import userService from 'App/Services/User'
import { roles } from 'App/Helpers/constants'

const listLtas = async (user: User, countryId?: number): Promise<Lta[]> => {
  const query = Lta.query()
  if (!userService.checkUserRole(user, [roles.gigaAdmin, roles.gigaViewOnly])) {
    countryId = user.countryId
  }
  if (countryId) query.where('country_id', countryId)
  return query
}

export default {
  listLtas
}
