import Safe from 'App/Models/Safe'
import User from 'App/Models/User'

import gnosisSafe from 'App/Helpers/gnosisSafe'
import Ethers from 'App/Helpers/ethers'
import { roles } from 'App/Helpers/constants'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

const NODE_ENV = process.env.NODE_ENV || ''

export const execute = async (email?: string) => {
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
    console.log(error)
  }
}

export const handleUser = async (user: User, safes: Safe[], trx: TransactionClientContract) => {
  let safeName: string
  const userRole = user.roles[0].name

  if (userRole === roles.isp) {
    await user.load('isp')
    safeName = user.isp[0].name
  } else {
    safeName = `${userRole}${user.country?.name ? `.${user.country?.name}` : ''}`
  }

  await findAndAddToSafe(safes, safeName, user, trx)
}

export const createUserWallet = async (user: User, trx: TransactionClientContract) => {
  const wallet = Ethers.createWallet()
  const address = await wallet.getAddress()
  console.log({
    userId: user.id,
    privateKey: wallet.privateKey,
    phrase: wallet.mnemonic.phrase,
  })
  user.walletAddress = address
  return user.useTransaction(trx).save()
}

export const findAndAddToSafe = async (
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
      safeAddress: safe.address,
    })
  }
  console.log(`No safe found: ${safeName}`)
}
