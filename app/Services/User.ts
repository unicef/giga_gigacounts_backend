import User from 'App/Models/User'
import { roles } from 'App/Helpers/constants'

interface UserProfile {
  name: string
  email: string
  country?: string
  role: string
}

const getProfile = async (user?: User): Promise<UserProfile | undefined> => {
  if (!user) return
  const shouldReturnCountry = user.roles.some(
    (v) => [roles.countryOffice, roles.government].indexOf(v.name) >= 0
  )
  return {
    name: user.name,
    email: user.email,
    country: shouldReturnCountry ? user.country.name : undefined,
    role: user.roles[0].name,
  }
}

export default {
  getProfile,
}
