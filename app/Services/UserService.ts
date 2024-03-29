import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

import User from 'App/Models/User'
import { adminUserEmail, permissions, roles, schedulerUserEmail } from 'App/Helpers/constants'
import roleService from 'App/Services/RoleService'
import Country from 'App/Models/Country'
import Ethers from 'App/Helpers/ethers'
import DatabaseException from 'App/Exceptions/DatabaseException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import SignedMessageException from 'App/Exceptions/SignedMessageException'

import { v1 } from 'uuid'
import Role from 'App/Models/Role'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

import dto, { GetUnapprovedUser, GetUser } from 'App/DTOs/User'
import ExternalContact from 'App/Models/ExternalContact'

import Safe from '@safe-global/protocol-kit'
import { SafeTransaction } from '@safe-global/safe-core-sdk-types'
import UnAuthorizedException from 'App/Exceptions/UnauthorizedException'
import Isp from 'App/Models/Isp'

export interface Tx {
  safeSdk: Safe
  tx: SafeTransaction
}

interface UserProfile {
  id: string
  name: string
  role?: {
    name: string
    code: string
    permissions: string[]
  }
  lastName: string
  displayName: string
  about: string
  address: string
  zipCode: string
  phoneNumber: string
  photoUrl: string
  email: string
  country?: Partial<Country>
  walletAddress?: string
  isp?: { id: number; name: string }
  automaticContractsEnabled?: boolean
  approved?: boolean
}

interface AttachWalletData {
  user: User
  address: string
  message: string
}

const getProfile = async (user?: User): Promise<UserProfile | undefined> => {
  if (!user) return
  const userPermissions = await roleService.getRolesPermission(user.roles)
  if (
    await checkUserRole(user, [
      // roles.isp
      roles.ispContractManager,
      roles.ispCustomerService
    ])
  )
    await user.load('isp')
  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    lastName: user.lastName,
    role: {
      name: user.roles[0]?.name,
      code: user.roles[0]?.code,
      permissions: userPermissions
    },
    displayName: `${user.name} ${user.lastName}`,
    about: user.about || '',
    address: user.address || '',
    zipCode: user.zipCode || '',
    phoneNumber: user.phoneNumber || '',
    photoUrl: user.photoUrl || '',
    automaticContractsEnabled: user.automaticContractsEnabled || false,
    country:
      userPermissions.some((v) => v === permissions.countryRead) && user.country
        ? {
            id: user.country?.id,
            name: user.country?.name,
            flagUrl: user.country?.flagUrl,
            code: user.country?.code
          }
        : undefined,
    walletAddress: user?.walletAddress,
    approved: user.approved,
    isp:
      user.isp?.length > 0
        ? {
            id: user.isp[0].id,
            name: user.isp[0].name
          }
        : undefined
  }
}

const register = async (country: string, email: string, givenName: string) => {
  const countryData = await Country.query().where("name", country).firstOrFail()

  const unnaprovedUser = User.create({
    name: givenName.split(' ')[0],
    lastName: givenName.split(' ')[1],
    email: email,
    password: "",
    countryId: countryData.id || 0,
    approved: false,
    phoneNumber: "",
    zipCode: "",
    photoUrl: "",
    address: "",
    about: "",
  })

  return unnaprovedUser
}

const approve = async (unapprovedUserId: number, roleCode: string, ispId: number) => {
  const unnaprovedUser = await User.query().where("id", unapprovedUserId).firstOrFail()
  const rolesWithoutAdminOrInternal = await roleService.getRoles();
  const roleCodes = rolesWithoutAdminOrInternal.map(role => role.code);

  if (roleCodes.includes(roleCode)) {
    const role = await Role.query().where("code", roleCode).first()

    if (roleCode === roles.ispContractManager || roleCode === roles.ispCustomerService) {
      const isp = await Isp.query().where("id", ispId).first()

      if (isp) {     
        if (unnaprovedUser.countryId === isp.countryId) {
          await unnaprovedUser.related('isp').detach()   
          await unnaprovedUser.related("isp").attach([isp.id])
        } else {
          throw Error("The ISP is not available in the country.")
        } 
      } else {
        throw Error("The ISP is not valid.")
      }
    }

    if (role) {
      await unnaprovedUser.related('roles').detach()
      await unnaprovedUser.related('roles').attach([role.id])
      unnaprovedUser.approved = true
    }
  }

  await unnaprovedUser.save()
  
  return unnaprovedUser
}

const unapprovedUserChange = async (user: User, roleCode: string, ispId?: number) => {
  const rolesWithoutAdminOrInternal = await roleService.getRoles();
  const roleCodes = rolesWithoutAdminOrInternal.map(role => role.code);

  if (roleCodes.includes(roleCode)) {
    const role = await Role.query().where("code", roleCode).first()

    if (roleCode === roles.ispContractManager || roleCode === roles.ispCustomerService) {
      if (!ispId) {
        throw Error("The ISP is not recognized.")
      }
      
      const isp = await Isp.query().where("id", ispId).first()

      if (isp) {        
        if (user.countryId === isp.countryId) {
          await user.related("isp").attach([isp.id])
        } else {
          throw Error("The ISP is not available in the country.")
        } 
      } else {
        throw Error("The ISP is not valid.")
      }
    }

    if (role) {
      await user.related('roles').detach()
      await user.related('roles').attach([role.id])
    }
  }

  await user.save()
  await user.load('country')
  await user.load('roles')
  await user.load('isp')
  return user
}

const checkUserRole = async (user: User, rolesToCheck: string[]): Promise<boolean> => {
  if (user.roles) {
    return user.roles.some((v) => {
      return rolesToCheck.includes(v.code)
    })
  } else {
    const userDB = (await User.findBy('id', user.id)) as User
    const userRoles = userDB.roles.map((role) => role.code)
    return userRoles.some((v) => {
      return rolesToCheck.includes(v)
    })
  }
}

const generateWalletRandomString = async (user: User) => {
  const randomString = `This is a verification message. Please sign it with your wallet to verify ownership \n${v1()}`
  user.walletRequestString = randomString
  await user.save()
  return randomString
}

const attachWallet = async ({ user, address, message }: AttachWalletData) => {
  const trx = await Database.transaction()
  try {
    let removeTx: Tx | undefined
    let addTx: Tx | undefined

    const AddressFromSignedMessage = Ethers.recoverAddress(user.walletRequestString!, message)
    if (AddressFromSignedMessage.toLowerCase() === address.toLowerCase()) {
      user.walletAddress = address
      user.walletRequestString = undefined
      await user.useTransaction(trx).save()
      await commitAttachWallet(trx, addTx, removeTx)
      return user
    }
    throw new SignedMessageException('Invalid signed message', 400, 'INVALID_MESSAGE')
  } catch (error) {
    await trx.rollback()
    if (error?.code === '23505')
      throw new SignedMessageException(
        'Wallet address is attached to another existing user',
        400,
        'ALREADY_ATTACHED'
      )
    if ([404, 400, 424].some((status) => status === error?.status)) throw error
    throw new DatabaseException('Some database error occurred while attaching wallet')
  }
}

const commitAttachWallet = async (trx: TransactionClientContract, addTx?: Tx, removeTx?: Tx) => {
  try {
    if (addTx) await addTx.safeSdk.executeTransaction(addTx.tx)
    if (removeTx) await removeTx.safeSdk.executeTransaction(removeTx.tx)
    return trx.commit()
  } catch (error) {
    throw { message: error.message, status: 424 }
  }
}

const gigaTokenWalletOwnerAddress = async () => {
  try {
    const user = (await User.query().where('email', adminUserEmail).first()) as User
    return { walletAddress: user.walletAddress }
  } catch (error) {
    if ([404, 400, 424].some((status) => status === error?.status)) throw error
    throw new DatabaseException('Some database error occurred while getting owner wallet address')
  }
}

const getPermissionsByEmail = async (email: string) => {
  const user = (await User.query().where('email', email).first()) as User

  if (!user) throw new NotFoundException('User not found')

  return {
    permissions: await roleService.getRolesPermission(user.roles),
    userId: user.id,
    countryId: user.countryId
  }
}

const updateSettingAutomaticContracts = async (
  user: User,
  automaticContractsEnabled: boolean
): Promise<User> => {
  user.automaticContractsEnabled = automaticContractsEnabled
  await user.save()
  return user
}

const listUsers = async (
  user: User,
  externalUsers: boolean,
  countryId?: number,
  rolesToSearch?: string[],
  ispId?: number
): Promise<GetUser[]> => {
  const { query } = await queryBuilderUser(user, countryId, rolesToSearch, ispId)
  const users: User[] = await query

  if (externalUsers) {
    const { queryExternalContacts } = await queryBuilderExternalContact(user, countryId, ispId)
    const exContacts: ExternalContact[] = await queryExternalContacts

    const usersDTO = dto.getUsersByUserDTO(users)
    const externalContactsDTO = dto.getExternalContactsByExternalContactDTO(exContacts)

    return [...usersDTO, ...externalContactsDTO]
  } else {
    const usersDTO = dto.getUsersByUserDTO(users)

    return usersDTO
  }
}

const listUnapprovedUsers = async (
  user: User,
): Promise<GetUnapprovedUser[]> => {
  const isAdmin = await checkUserRole(user, [roles.gigaAdmin, roles.gigaViewOnly])

  if (!isAdmin) {
    throw new UnAuthorizedException(
      'The current user does not have the required permissions to list the unapproved users.'
    )
  }

  const users = await User.query().where("approved", false).preload('country')
  const usersDto = dto.getUnapprovedUsersByUnapprovedUserDTO(users)
  return usersDto
}

const queryBuilderUser = async (
  user: User,
  countryId?: number,
  rolesToSearch?: string[],
  ispId?: number
): Promise<{
  query: ModelQueryBuilderContract<typeof User, User>
}> => {
  let query = User.query()
              .whereNot('id', user.id)
              .whereNot('email', schedulerUserEmail)
              .where('approved', true)

  if (
    await checkUserRole(user, [
      roles.countryContractCreator,
      roles.countryAccountant,
      roles.countrySuperAdmin,
      roles.countryMonitor
    ])
  ) {
    countryId = user.countryId
  }

  if (countryId) {
    query.andWhere('country_id', countryId)
  }

  if (rolesToSearch && rolesToSearch.length > 0) {
    const rolesToRemove = [roles.gigaAdmin, roles.gigaViewOnly]
    const filteredRoles = rolesToSearch.filter((role) => !rolesToRemove.includes(role))
    query.whereHas('roles', (builder) => {
      builder.whereIn('code', filteredRoles)
    })
  }
  query.preload('roles')
  query.preload('country')
  query.preload('isp')

  if (ispId) {
    query.whereHas('isp', (builder) => {
      builder.where('isp_id', ispId)
    })
  }

  return { query }
}

const queryBuilderExternalContact = async (
  user: User,
  countryId?: number,
  ispId?: number
): Promise<{
  queryExternalContacts: ModelQueryBuilderContract<typeof ExternalContact, ExternalContact>
}> => {
  let queryExternalContacts = ExternalContact.query().preload('isp').preload('country')

  if (
    await checkUserRole(user, [
      roles.countryContractCreator,
      roles.countryAccountant,
      roles.countrySuperAdmin,
      roles.countryMonitor
    ])
  ) {
    countryId = user.countryId
  }

  if (countryId) {
    queryExternalContacts.andWhere('country_id', countryId)
  }

  if (ispId) {
    queryExternalContacts.whereHas('isp', (builder) => {
      builder.where('isp_id', ispId)
    })
  }

  return { queryExternalContacts }
}

const getGigaSuperAdminUser = async () => {
  const user = await User.query()
    .join('user_roles', (query) => {
      query.on((subquery) => {
        subquery.on('users.id', '=', 'user_roles.user_id')
      })
    })
    .join('roles', (query) => {
      query.on((subquery) => {
        subquery.on('roles.id', '=', 'user_roles.role_id')
      })
    })
    .where('roles.code', '=', 'GIGA.SUPER.ADMIN')
    .limit(1)

  return user
}

const getGigaSchedulerUser = async (): Promise<User> => {
  return (await User.query().where('email', schedulerUserEmail).limit(1).first()) as User
}

export default {
  getProfile,
  checkUserRole,
  register,
  approve,
  generateWalletRandomString,
  attachWallet,
  getPermissionsByEmail,
  updateSettingAutomaticContracts,
  listUsers,
  unapprovedUserChange,
  listUnapprovedUsers,
  gigaTokenWalletOwnerAddress,
  getGigaSuperAdminUser,
  getGigaSchedulerUser
}
