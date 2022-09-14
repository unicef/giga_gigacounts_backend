import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import Safe, { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk'
import { ethers } from 'ethers'

import Ethers from 'App/Helpers/ethers'
import utils from 'App/Helpers/utils'

import { SafeTransaction, TransactionResult } from '@gnosis.pm/safe-core-sdk-types'

interface DeploySafeData {
  owners: string[]
  threshold?: number
}

interface AddOwnersToSafe {
  newOwner: string
  safeAddress: string
  newThreshold?: number
}

export interface Tx {
  safeSdk: Safe
  tx: SafeTransaction
}

const deploySafe = async ({ owners, threshold = 1 }: DeploySafeData) => {
  const provider = Ethers.getProvider()
  const signer = await Ethers.getWalletAndConnect(provider)
  const ethAdapter = new EthersAdapter({
    ethers,
    signer: signer,
  })
  const internalWalletAddress = await signer.getAddress()

  const safeFactory = await SafeFactory.create({ ethAdapter })

  owners.push(internalWalletAddress)
  const safeAccountConfig: SafeAccountConfig = {
    owners,
    threshold,
  }
  const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })
  return safeSdk.getAddress()
}

const addOwnerToSafe = async (
  { newOwner, safeAddress, newThreshold }: AddOwnersToSafe,
  trx: boolean = false
): Promise<TransactionResult | Tx> => {
  const provider = Ethers.getProvider()
  const signer = await Ethers.getWalletAndConnect(provider)
  const ethAdapter = new EthersAdapter({
    ethers,
    signer: signer,
  })

  const safeSdk = await Safe.create({ ethAdapter, safeAddress })
  const tx = await safeSdk.getAddOwnerTx({ ownerAddress: newOwner, threshold: newThreshold })
  return trx ? { safeSdk, tx } : safeSdk.executeTransaction(tx)
}

const getSafeInfo = async (safeAddress: string) => {
  const provider = Ethers.getProvider()
  const signer = await Ethers.getWalletAndConnect(provider)
  const ethAdapter = new EthersAdapter({
    ethers,
    signer: signer,
  })

  const safeSdk = await Safe.create({ ethAdapter, safeAddress })

  return {
    balance: utils.toNormalNumber(await safeSdk.getBalance()),
    owners: await safeSdk.getOwners(),
    threshold: await safeSdk.getThreshold(),
  }
}

const removeOwnerOfSafe = async (
  safeAddress: string,
  ownerAddress: string,
  trx: boolean = false,
  threshold: number = 1
): Promise<TransactionResult | Tx> => {
  const provider = Ethers.getProvider()
  const signer = await Ethers.getWalletAndConnect(provider)
  const ethAdapter = new EthersAdapter({
    ethers,
    signer: signer,
  })

  const safeSdk = await Safe.create({ ethAdapter, safeAddress })
  const tx = await safeSdk.getRemoveOwnerTx({ ownerAddress, threshold })
  return trx ? { safeSdk, tx } : safeSdk.executeTransaction(tx)
}

export default {
  deploySafe,
  addOwnerToSafe,
  getSafeInfo,
  removeOwnerOfSafe,
}
