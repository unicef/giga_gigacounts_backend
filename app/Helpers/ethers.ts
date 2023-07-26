import { ethers } from 'ethers'
import { hashMessage } from 'ethers/lib/utils'

type Provider = ethers.providers.Provider

const INFURA_API_KEY = process.env.INFURA_API_KEY || ''
const ETH_NETWORK = process.env.ETH_NETWORK || ''

const getProvider = () => new ethers.providers.InfuraProvider(ETH_NETWORK, INFURA_API_KEY)

const getWalletAndConnect = async (provider: Provider) => {
  const privateKey = process.env.PRIVATE_KEY || ''
  const wallet = new ethers.Wallet(privateKey, provider)
  return wallet.connect(provider)
}

const createWallet = () => ethers.Wallet.createRandom()

const recoverAddress = (walletRequestString: string = '', message: string) =>
  ethers.utils.recoverAddress(hashMessage(walletRequestString), message)

export default {
  getProvider,
  getWalletAndConnect,
  createWallet,
  recoverAddress
}
