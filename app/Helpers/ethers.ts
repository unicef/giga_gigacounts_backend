import { ethers } from 'ethers'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'

const web3Provider = new ethers.providers.JsonRpcProvider()

const provider = new ethers.providers.Web3Provider({
  host: 'https://rinkeby.infura.io/v3/14f651fc4ac44a7a94983b6602ba2f5c',
})
const safeOwner = provider.getSigner(0)

const ethAdapter = new EthersAdapter({
  ethers,
  signer: safeOwner,
})
