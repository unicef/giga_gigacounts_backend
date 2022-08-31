import { ethers } from 'ethers'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import Safe, { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk'

const initialize = async () => {
  // const provider = new ethers.providers.Web3Provider({})
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rinkeby.infura.io/v3/14f651fc4ac44a7a94983b6602ba2f5c',
    4
  )
  // wallet
  const privateKey = '0x8f315594fa971e92912b39d284fe0f6149983e0b62a422644f464191b8877329'
  const wallet = new ethers.Wallet(privateKey, provider)
  console.log({ wallet })

  const owner1 = await wallet.getAddress()
  const safeOwner = provider.getSigner(owner1)

  const ethAdapter = new EthersAdapter({
    ethers,
    signer: safeOwner,
  })

  const safeFactory = await SafeFactory.create({ ethAdapter })

  const owners = [owner1]
  const threshold = 1
  const safeAccountConfig: SafeAccountConfig = {
    owners,
    threshold,
  }

  const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig })
  console.log({ safeSdk })
  //   const newSafeAddress = safeSdk.getAddress()
  //   console.log({ newSafeAddress })
}

export default {
  initialize,
}
