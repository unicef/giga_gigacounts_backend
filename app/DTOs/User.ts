import User from 'App/Models/User'

export interface GetUser {
  id: number
  name: string
  lastName: string
  completeName: string
  role: {
    code?: string,
    name?: string
  }
  countryId?: number
  countryName?: string
  walletAddress?: string
  email: string
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
  email: user.email
})

const getUsersByUserDTO = (users: User[]): GetUser[] => {
  return users.map(getUserDTO)
}

export default {
  getUsersByUserDTO
}
