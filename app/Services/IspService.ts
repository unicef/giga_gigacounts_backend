import Isp from 'App/Models/Isp'
import User from 'App/Models/User'

import userService from 'App/Services/UserService'
import { roles } from 'App/Helpers/constants'

const listIsps = async (user: User, countryId?: number): Promise<Isp[]> => {
  const query = Isp.query()
  if (!(await userService.checkUserRole(user, [roles.gigaAdmin, roles.gigaViewOnly]))) {
    countryId = user.countryId
  }
  if (countryId) query.where('country_id', countryId)
  return query
}

export default {
  listIsps
}
