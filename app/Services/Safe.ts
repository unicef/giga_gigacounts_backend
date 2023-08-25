import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

import Safe from 'App/Models/Safe'
import User from 'App/Models/User'

import gnosisSafe from 'App/Helpers/gnosisSafe'
import Ethers from 'App/Helpers/ethers'
import { roles } from 'App/Helpers/constants'

import NotFoundException from 'App/Exceptions/NotFoundException'

const NODE_ENV = process.env.NODE_ENV || ''

const getSafeByUserRole = async (user: User) => {
  let safeName: string
  await user.load('roles')

  // if (user.roles[0].name === roles.isp) {
  if (
    user.roles[0].name === roles.ispContractManager ||
    user.roles[0].name === roles.ispCustomerService
  ) {
    await user.load('isp')
    safeName = user.isp[0].name
  } else {
    safeName = `${user.roles[0].name}${user.country?.name ? `.${user.country?.name}` : ''}`
  }

  const safe = await Safe.findBy('name', safeName)
  if (!safe) throw new NotFoundException('Safe not found')

  return safe
}

const createSafe = async (name: string) => {
  const safeAddress = await gnosisSafe.deploySafe({ owners: [] })
  return Safe.create({ address: safeAddress, name })
}

const addUsersToSafe = async (email?: string) => {
  const trx = await Database.transaction()
  try {
    const safes = await Safe.all({ client: trx })
    let users: User[]

    if (email) {
      // It will return an array with one user or empty if doesnt exist
      users = await User.query()
        .useTransaction(trx)
        .where('email', email)
        .preload('roles')
        .preload('country')
    } else {
      users = await User.query().useTransaction(trx).preload('roles').preload('country')
    }

    for (const user of users) {
      if (!user.walletAddress) {
        if (NODE_ENV !== 'production') {
          await createUserWallet(user, trx)
        } else {
          continue
        }
      }

      await handleUser(user, safes, trx)
    }

    await trx.commit()
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

const createUserWallet = async (user: User, trx: TransactionClientContract) => {
  const wallet = Ethers.createWallet()
  const address = await wallet.getAddress()
  user.walletAddress = address
  return user.useTransaction(trx).save()
}

const handleUser = async (user: User, safes: Safe[], trx: TransactionClientContract) => {
  let safeName: string
  const userRole = user.roles[0].name

  // if (userRole === roles.isp) {
  if (userRole === roles.ispContractManager || userRole === roles.ispCustomerService) {
    await user.load('isp')
    safeName = user.isp[0].name
  } else {
    safeName = `${userRole}${user.country?.name ? `.${user.country?.name}` : ''}`
  }

  await findAndAddToSafe(safes, safeName, user, trx)
}

const findAndAddToSafe = async (
  safes: Safe[],
  safeName: string,
  user: User,
  trx: TransactionClientContract
) => {
  const safe = safes.find(({ name }) => name === safeName)
  if (safe) {
    user.safeId = safe.id
    await user.useTransaction(trx).save()
    return gnosisSafe.addOwnerToSafe({
      newOwner: user.walletAddress || '',
      safeAddress: safe.address
    })
  }
  console.info(`No safe found: ${safeName}`)
}

export default {
  getSafeByUserRole,
  createSafe,
  addUsersToSafe
}
