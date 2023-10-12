import ExternalContact from 'App/Models/ExternalContact'
import User from 'App/Models/User'

export interface GetUser {
  id: number
  name: string
  lastName: string
  completeName: string
  role: {
    code?: string
    name?: string
  }
  countryId?: number
  countryName?: string
  walletAddress?: string
  email: string
  ispId?: number
  ispName?: string
  phoneNumber?: string
}

const getUserDTO = (user: User): GetUser => ({
  id: user.id,
  name: user.name,
  lastName: user.lastName,
  completeName: `${user.name}, ${user.lastName}`,
  role: {
    code: user.roles[0]?.code,
    name: user.roles[0]?.name
  },
  walletAddress: user?.walletAddress,
  countryId: user.countryId,
  countryName: user.country?.name || '',
  email: user.email,
  ispId: user.isp[0]?.id,
  ispName: user.isp[0]?.name,
  phoneNumber: user.phoneNumber
})

const getExternalContactDTO = (user: ExternalContact): GetUser => ({
  id: user.id,
  name: user.name,
  lastName: '',
  completeName: `${user.name}`,
  role: {
    code: '',
    name: 'External Contact'
  },
  walletAddress: '',
  countryId: user.countryId,
  countryName: user.country?.name || '',
  email: user.email,
  ispId: user.ispId,
  ispName: user.isp.name,
  phoneNumber: user.phoneNumber
})

const getUsersByUserDTO = (users: User[]): GetUser[] => {
  return users.map(getUserDTO)
}

const getExternalContactsByExternalContactDTO = (users: ExternalContact[]): GetUser[] => {
  return users.map(getExternalContactDTO)
}

export default {
  getUsersByUserDTO,
  getExternalContactsByExternalContactDTO
}
