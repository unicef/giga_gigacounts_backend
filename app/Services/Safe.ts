import Safe from 'App/Models/Safe'
import User from 'App/Models/User'
import { roles } from 'App/Helpers/constants'

import NotFoundException from 'App/Exceptions/NotFoundException'

const getSafeByUserRole = async (user: User) => {
  let safeName: string
  await user.load('roles')

  if (user.roles[0].name === roles.isp) {
    await user.load('isp')
    safeName = user.isp[0].name
  } else {
    safeName = `${user.roles[0].name}${user.country?.name ? `.${user.country?.name}` : ''}`
  }

  const safe = await Safe.findBy('name', safeName)
  if (!safe) throw new NotFoundException('Safe not found', 404, 'NOT_FOUND')

  return safe
}

export default {
  getSafeByUserRole,
}
