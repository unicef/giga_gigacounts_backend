import Contract from 'App/Models/Contract'
import User from 'App/Models/User'

import { roles } from 'App/Helpers/constants'
import userService from 'App/Services/User'
import dto, { ContractsStatusCount } from 'App/DTOs/Contract'

const getContractsCountByStatus = async (
  user?: User
): Promise<ContractsStatusCount | undefined> => {
  if (!user) return
  let query = Contract.query()

  if (!userService.checkUserRole(user, [roles.gigaAdmin])) {
    query.where('countryId', user.countryId)

    if (userService.checkUserRole(user, [roles.government])) {
      query.andWhere('governmentBehalf', true)
    }

    if (userService.checkUserRole(user, [roles.isp])) {
      query.whereHas('isp', (qry) => {
        qry.where('name', user.name)
      })
    }
  }

  const totalCount = await query.count('*')
  const contracts = await query.select('status').distinct('status').groupBy('status').count('*')
  return dto.contractCountByStatusDTO(contracts, totalCount[0].$extras.count)
}

export default {
  getContractsCountByStatus,
}
