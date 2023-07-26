import Isp from 'App/Models/Isp'
import User from 'App/Models/User'

import userService from 'App/Services/User'
import { roles } from 'App/Helpers/constants'

const listIsps = async (user: User, ltaId?: number, countryId?: number): Promise<Isp[]> => {
  const query = Isp.query()
  if (!userService.checkUserRole(user, [roles.gigaAdmin, roles.gigaViewOnly])) {
    countryId = user.countryId
  }
  if (countryId) query.where('country_id', countryId)
  if (ltaId) {
    query.whereHas('ltas', (qry) => {
      qry.where('lta_id', ltaId)
    })
  }
  return query
}

export default {
  listIsps
}
