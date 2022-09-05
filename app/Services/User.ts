import User from 'App/Models/User'

import { permissions, roles } from 'App/Helpers/constants'
import roleService from 'App/Services/Role'
import Country from 'App/Models/Country'
import Safe from 'App/Models/Safe'

import { v1 } from 'uuid'

interface UserProfile {
  name: string
  lastName: string
  email: string
  country?: Partial<Country>
  role: string
  safeId?: number
  safe?: Safe
  walletAddress?: string
  isp?: { id: number; name: string }
}

const getProfile = async (user?: User): Promise<UserProfile | undefined> => {
  if (!user) return
  const userPermissions = await roleService.getRolesPermission(user.roles)
  if (user.safeId) await user.load('safe')
  if (checkUserRole(user, [roles.isp])) await user.load('isp')
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
    safeId: user?.safeId,
    safe: user?.safe,
    walletAddress: user?.walletAddress,
    isp:
      user.isp?.length > 0
        ? {
            id: user.isp[0].id,
            name: user.isp[0].name,
          }
        : undefined,
  }
}

const checkUserRole = (user: User, rolesToCheck: string[]): boolean => {
  return user.roles.some((v) => rolesToCheck.indexOf(v.name) >= 0)
}

const generateWalletRandomString = async (user: User) => {
  const randomString = v1()
  user.walletRequestString = randomString
  await user.save()
  return randomString
}

export default {
  getProfile,
  checkUserRole,
  generateWalletRandomString,
}
