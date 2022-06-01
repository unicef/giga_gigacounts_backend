import User from 'App/Models/User'

import { permissions } from 'App/Helpers/constants'
import roleService from 'App/Services/Role'

interface UserProfile {
  name: string
  email: string
  country?: string
  role: string
}

const getProfile = async (user?: User): Promise<UserProfile | undefined> => {
  if (!user) return
  const userPermissions = await roleService.getRolesPermission(user.roles)
  return {
    name: user.name,
    email: user.email,
    country: userPermissions.some((v) => v === permissions.countryRead)
      ? user.country?.name
      : undefined,
    role: user.roles[0].name,
  }
}

const checkUserRole = (user: User, rolesToCheck: string[]): boolean => {
  return user.roles.some((v) => rolesToCheck.indexOf(v.name) >= 0)
}

export default {
  getProfile,
  checkUserRole,
}
