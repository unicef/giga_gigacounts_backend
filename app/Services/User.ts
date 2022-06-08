import User from 'App/Models/User'

import { permissions } from 'App/Helpers/constants'
import roleService from 'App/Services/Role'
import Country from 'App/Models/Country'

interface UserProfile {
  name: string
  lastName: string
  email: string
  country?: Partial<Country>
  role: string
}

const getProfile = async (user?: User): Promise<UserProfile | undefined> => {
  if (!user) return
  const userPermissions = await roleService.getRolesPermission(user.roles)
  return {
    name: user.name,
    email: user.email,
    lastName: user.lastName,
    country:
      userPermissions.some((v) => v === permissions.countryRead) && user.country
        ? {
            name: user.country?.name,
            flagUrl: user.country?.flagUrl,
            code: user.country?.code,
          }
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
