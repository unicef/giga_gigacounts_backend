import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

import User from 'App/Models/User'
import { permissions, roles } from 'App/Helpers/constants'
import roleService from 'App/Services/Role'
import Country from 'App/Models/Country'
import Safe from 'App/Models/Safe'
import safeService from 'App/Services/Safe'
import gnosisSafe, { Tx } from 'App/Helpers/gnosisSafe'
import Ethers from 'App/Helpers/ethers'
import utils from 'App/Helpers/utils'

import FailedDependencyException from 'App/Exceptions/FailedDependencyException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import SignedMessageException from 'App/Exceptions/SignedMessageException'

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

interface AttachWalletData {
  user: User
  address: string
  message: string
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

    if (Ethers.recoverAddress(user.walletRequestString, message) !== address)
      throw new SignedMessageException('Invalid signed message', 400, 'INVALID_MESSAGE')

    if (user.safeId && user?.walletAddress) {
      const userSafe = await Safe.find(user.safeId, { client: trx })
      if (!userSafe) throw new NotFoundException('Safe not found', 404, 'NOT_FOUND')
      removeTx = (await gnosisSafe.removeOwnerOfSafe(
        userSafe.address,
        user?.walletAddress,
        true
      )) as Tx
    }

    const safe = await safeService.getSafeByUserRole(user)
    if (safe) {
      addTx = (await gnosisSafe.addOwnerToSafe(
        { newOwner: address, safeAddress: safe.address },
        true
      )) as Tx
      user.safeId = safe.id
    }

    user.walletAddress = address
    user.walletRequestString = undefined
    await user.useTransaction(trx).save()

    await commitAttachWallet(trx, addTx, removeTx)
    return user
  } catch (error) {
    await trx.rollback()
    if (error?.code === '23505')
      throw utils.handleDBError('Wallet address is attached to another existing user', 400)
    if ([404, 400, 424].some((status) => status === error?.status)) throw error
    throw new FailedDependencyException(
      'Some dependency failed while attaching wallet',
      424,
      'FAILED_DEPENDENCY'
    )
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

export default {
  getProfile,
  checkUserRole,
  generateWalletRandomString,
  attachWallet,
}
