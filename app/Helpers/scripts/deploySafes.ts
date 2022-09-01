import Database from '@ioc:Adonis/Lucid/Database'

import User from 'App/Models/User'
import Safe from 'App/Models/Safe'

import gnosisSafe from 'App/Helpers/gnosisSafe'

interface RolesObj {
  [name: string]: {
    id: number
    address: string
  }
}

export const main = async () => {
  const trx = await Database.transaction()
  try {
    const roles: RolesObj = {}
    const users = await User.query().useTransaction(trx).preload('roles').preload('country')

    for (const user of users) {
      const userRole = user.roles[0].name
      const userCountry = user.country?.name ? `.${user.country?.name}` : ''

      if (!roles[`${userRole}${userCountry}`]) {
        const safeAddress = await gnosisSafe.deploySafe({ owners: [] })
        const safe = await Safe.create({ address: safeAddress }, { client: trx })
        roles[`${userRole}${userCountry}`] = { id: safe.id, address: safe.address }
      }

      user.safeId = roles[`${userRole}${userCountry}`].id

      await gnosisSafe.addOwnerToSafe({
        newOwner: user.walletAddress || '',
        safeAddress: roles[`${userRole}${userCountry}`].address,
      })

      await user.useTransaction(trx).save()

      await trx.commit()
    }
  } catch (error) {
    await trx.rollback()
    console.log(error)
  }
}

// Country Office.Brazil
// Country Office.Botswana
// Country Office.Brazil
// Government.Botswana
// Giga Admin
// Giga Admin
// Government.Brazil
// ISP.Botswana
// ISP.Brazil
