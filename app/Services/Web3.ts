import { ContractStatus, NotificationSources, PaymentStatus } from 'App/Helpers/constants'
import Contract from 'App/Models/Contract'
import Currency from 'App/Models/Currency'
import User from 'App/Models/User'
import { ethers } from 'ethers'
import { abiHandler } from 'App/Helpers/abis/abiHandlerv5'
import { abiToken } from 'App/Helpers/abis/abiToken'
import { DateTime } from 'luxon'
import service, { BlockchainTransactionCreation } from 'App/Services/BlockchainTransactions'
import NotificationsService from 'App/Services/Notifications'
import userSerivce from 'App/Services/User'
import paymentSerivce, { CreatePaymentData } from 'App/Services/Payment'
import Database from '@ioc:Adonis/Lucid/Database'

export interface Chain {
  namespace?: 'evm'
  id: string
  rpcUrl?: string
  label?: string
  token?: string
  publicRpcUrl?: string
  protectedRpcUrl?: string
  blockExplorerUrl?: string
}

type WalletBalance = {
  token: string
  balance: number
}


interface AutomaticPaymentContractType {
  contract_id: number;
  contract_name: string;
  payment_receiver_id: number;
  contract_budget: number;
  frecuency_id: number;
  start_date: DateTime;
  end_date: DateTime;
  currency_id: number;
  contract_Uptime: number;
  contract_Latency: number;
  contract_DSpeed: number;
  contract_USeepd: number;
  qtty_schools_sla_ok_period: number;
  payment_amount: number;
  payment_discount: number;
  payment_date_from: string;
  payment_date_to: string;
}

export const ENV_SUPPORTED_NETWORK_ID = parseInt(process.env.WEB3_NETWORK_ID || '0', 10)
export const SUPPORTED_NETWORKS: Record<number, Chain> = {
  137: {
    id: '137',
    token: 'MATIC',
    label: 'Polygon Mainnet',
    publicRpcUrl: 'https://polygon-rpc.com',
    rpcUrl: `${process.env.WEB3_NODE_PROVIDER_URL}${
      process.env.WEB3_NODE_PROVIDER_URL?.endsWith('/') ? '' : '/'
    }${process.env.WEB3_NODE_PROVIDER_KEY}`,
    blockExplorerUrl: 'https://polygonscan.com'
  },
  80001: {
    id: '80001',
    token: 'MATIC',
    label: 'Polygon testnet',
    publicRpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
    rpcUrl: `${process.env.WEB3_NODE_PROVIDER_URL}${
      process.env.WEB3_NODE_PROVIDER_URL?.endsWith('/') ? '' : '/'
    }${process.env.WEB3_NODE_PROVIDER_KEY}`
  }
}
export const ENV_SUPPORTED_NETWORK = SUPPORTED_NETWORKS[ENV_SUPPORTED_NETWORK_ID]

const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(
    SUPPORTED_NETWORKS[ENV_SUPPORTED_NETWORK_ID].rpcUrl,
    ENV_SUPPORTED_NETWORK_ID
  )
}

/**
 * Get Wallet Balance from Smart Contract
 *
 * @param walletAddress
 * @param tokenERC20ContractAddress
 * @returns
 */
const getWalletBalance = async (
  walletAddress: string,
  tokenERC20ContractAddress?: string
): Promise<WalletBalance[]> => {
  const defaultResult = [{ token: '', balance: 0 }]
  if (!walletAddress) return defaultResult

  try {
    const provider = getProvider()

    if (tokenERC20ContractAddress) {
      const erc20Contract = new ethers.Contract(
        tokenERC20ContractAddress,
        [
          'function balanceOf(address) view returns (uint256)',
          'function decimals() view returns (uint8)',
          'function symbol() view returns (string)'
        ],
        provider
      )
      const balanceWei = await erc20Contract.balanceOf(walletAddress)
      const decimals = await erc20Contract.decimals()
      const token: string = await erc20Contract.symbol()
      const balance: number = parseFloat(ethers.utils.formatUnits(balanceWei, decimals) || '0')
      return [{ token, balance }]
    } else {
      const balanceWei = await provider.getBalance(walletAddress)
      const token: string = SUPPORTED_NETWORKS[ENV_SUPPORTED_NETWORK_ID].token || ''
      const balance: number = parseFloat(ethers.utils.formatUnits(balanceWei) || '0')
      return [{ token, balance }]
    }
  } catch (err) {
    console.error(err)
  }
  return defaultResult
}

/**
 * Get Contract Token Data from Smart Contract
 *
 * @param tokenAddress
 * @returns
 */
const getContractTokenData = async (tokenAddress: string) => {
  try {
    const provider = getProvider()
    const contractToken = new ethers.Contract(tokenAddress, abiToken, provider)
    const name = await contractToken.name()
    const symbol = await contractToken.symbol()
    const decimals = await contractToken.decimals()
    return { name, symbol, decimals }
  } catch (err) {
    console.error('getContractBalance Error:', err)
  }
  return { name: '', symbol: '', decimals: '' }
}

/**
 * Get All Contract Funds from Smart Contract
 * @param contractId
 * @returns uint256[]: totalFunds, receivedFunds, payoutFunds, cashbackFunds
 */
const getAllContractFunds = async (contractId: string, tokenAddress: string) => {
  const defaultResult = [
    { token: '', totalFunds: 0, ReceivedFunds: 0, payoutFunds: 0, cashbackFunds: 0 }
  ]
  try {
    const provider = getProvider()
    const contractHandler = new ethers.Contract(
      process.env.WEB3_CONTRACTS_HANDLER_ADR || '',
      abiHandler,
      provider
    )

    const response = await contractHandler.getAllFunds(contractId, tokenAddress)
    const tokenData = await getContractTokenData(tokenAddress)
    const tokenName = tokenData.name
    const tokenSymbol = tokenData.symbol
    const tokenDecimals = tokenData.decimals
    const result = [
      {
        tokenName,
        tokenSymbol,
        tokenDecimals,
        totalFunds: parseFloat(ethers.utils.formatUnits(response[0], tokenDecimals) || '0'),
        ReceivedFunds: parseFloat(ethers.utils.formatUnits(response[1], tokenDecimals) || '0'),
        payoutFunds: parseFloat(ethers.utils.formatUnits(response[2], tokenDecimals) || '0'),
        cashbackFunds: parseFloat(ethers.utils.formatUnits(response[3], tokenDecimals) || '0')
      }
    ]
    return result
  } catch (err) {
    console.error('getContractAllFunds Error:', err)
  }
  return defaultResult
}

/**
 * Get Last Funds in wallet address from Smart Contract
 *
 * @param contractId
 * @param tokenAddress
 * @returns
 */
const getLastFundInAddress = async (contractId: string, tokenAddress: string): Promise<string> => {
  let result
  try {
    const provider = getProvider()
    const contractHandler = new ethers.Contract(
      process.env.WEB3_CONTRACTS_HANDLER_ADR || '',
      abiHandler,
      provider
    )
    console.log(contractId, tokenAddress)
    const response = await contractHandler.getlastFundInAddress(contractId, tokenAddress)
    result = response
  } catch (err) {
    console.error('getLastFundInAddress Error:', err)
  }
  return result ?? ''
}

/**
 * Call to Cashback function in Smart Contract
 *
 * @param contractId
 * @param tokenAddress
 * @returns
 */
const smartContractCashback = async (
  contractId: string,
  tokenAddress: string
): Promise<{ hash: string; status: number }> => {
  let result = { hash: '', status: 2 }
  try {
    const provider = getProvider()
    const wallet = new ethers.Wallet(process.env.WEB3_OWNER_SK || '', provider)
    const contractHandler = new ethers.Contract(
      process.env.WEB3_CONTRACTS_HANDLER_ADR || '',
      abiHandler,
      wallet
    )

    console.log('cashback: Try SC', wallet.address)
    let trx = await contractHandler.cashback(contractId, tokenAddress)
    console.log('cashback: call SC - trx hash ', trx.hash)
    result = { hash: trx.hash, status: 2 }

    const trxAwait = await trx.wait()
    console.log(`cashback: SC await result status ${trxAwait.status}`)
    result = { hash: trxAwait.transactionHash, status: parseInt(trxAwait.status) }
  } catch (err) {
    console.error('cashback: Error:', err)
  }
  return result
}

/**
 * Call to Create Payment in Smart Contract
 *
 * @param contractId
 * @param tokenAddress
 * @param amount
 * @param walletAddress
 * @returns
 */
const smartContractPayment = async (
  contractId: string,
  tokenAddress: string,
  amount: number,
  walletAddress: string
): Promise<{ hash: string; status: number }> => {
  let result = { hash: '', status: 2 }
  try {
    const provider = getProvider()
    const wallet = new ethers.Wallet(process.env.WEB3_OWNER_SK || '', provider)
    const contractHandler = new ethers.Contract(
      process.env.WEB3_CONTRACTS_HANDLER_ADR || '',
      abiHandler,
      wallet
    )

    const tokenDecimals = (await getContractTokenData(tokenAddress)).decimals
    const amountParsed = ethers.utils.parseUnits(amount.toString().replace(',', '.'), tokenDecimals)
    console.log('amountParsed:', amount.toString(), ethers.utils.formatUnits(amountParsed, tokenDecimals))

    console.log('automatic payment: Try SC', wallet.address)
    let trx = await contractHandler.makePayment(contractId, tokenAddress, amountParsed, walletAddress)
    console.log('automatic payment: call SC - trx hash ', trx.hash)
    result = { hash: trx.hash, status: 2 }

    const trxAwait = await trx.wait()
    console.log(`automatic payment: SC await result status ${trxAwait.status}`)
    result = { hash: trxAwait.transactionHash, status: parseInt(trxAwait.status) }
  } catch (err) {
    console.error('automatic payment: Error:', err)
  }
  return result
}

/**
 * Check currency contract address and if is correct to the network setted in environment
 *
 * @param currency
 * @returns
 */
const checkCurrency = (currency?: Currency): boolean => {
  if (!currency) return false

  if (!currency.contractAddress || currency.contractAddress.length === 0) return false

  if (currency.networkId.toString() !== process.env.WEB3_NETWORK_ID?.toString()) return false

  return true
}

/**
 * Generate Generic Notification for Cashback and automatic Payments
 *
 * @param message
 * @param prefix
 */
const notifyAutomaticError = async (message: string, prefix?: string) => {
  console.info(`${prefix || ''}${message}`)
  await NotificationsService.createGenericAutomaticContractNotifications(message)
}

/**
 * Validations for automatic Payments
 *
 * Check Currency in contract
 * Check Payment Receiver in contract and its wallet
 * Check Scheduler User's Wallet Funds
 * Check Contract balance in SC
 *
 * @param contract
 * @param user
 * @returns true/false
 */
const contractIsValidForAutomaticPayment = async (
  automaticPaymentContract: AutomaticPaymentContractType,
  user: User
): Promise<boolean> => {
  const name = automaticPaymentContract.contract_name
  try {
    const currency = (await Currency.query().where('id', automaticPaymentContract.currency_id).first()) as Currency
    // Check currency
    if (!checkCurrency(currency)) {
      const msg = `Invalid contract currency when try to create payments for automatic contract ${name}.`
      await notifyAutomaticError(msg, 'automatic payment: ')
      return false
    }

    // Check Payment Receiver in contract
    const paymentReiceverId = automaticPaymentContract.payment_receiver_id
    if (!paymentReiceverId) {
      const msg = `No payment receiver when try to create payments for automatic contract ${name}.`
      await notifyAutomaticError(msg, 'automatic payment: ')
      return false
    }

    // Check Payment Receiver Wallet
    const paymentReceiverUser = (await User.query()
      .where('id', paymentReiceverId || '')
      .first()) as User
    if (!paymentReceiverUser || !paymentReceiverUser.walletAddress) {
      const msg = `The payment receiver does not have a configured wallet to create 
        payments for automatic contract ${automaticPaymentContract.contract_name}.`
      await notifyAutomaticError(msg, 'automatic payment: ')
      return false
    }

    // Check Scheduler User's Wallet Funds
    const balances = await getWalletBalance(user.walletAddress || '')
    if (balances[0].balance <= 0) {
      const msg = `The wallet ${
        user.walletAddress || ''
      } doesn\'t have enough funds to make transactions for automatic contract ${name}.`
      await notifyAutomaticError(msg, 'automatic payment: ')
      return false
    }

    // Check Contract balance in SC
    let contractAllFunds = await getAllContractFunds(automaticPaymentContract.contract_id.toString(), currency.contractAddress)
    if (contractAllFunds[0].totalFunds < automaticPaymentContract.payment_amount) {
      const msg = `The automatic contract ${name} doesn\'t have enough funds to make automatic payments.`
      await notifyAutomaticError(msg, 'automatic payment: ')
      return false
    }

  } catch (error) {
    const msg = `Error ${error.message} validating automatic payments for automatic contract ${name}.`
    await notifyAutomaticError(msg, 'automatic payment: ')
  }

  console.log('automatic payments: all validations OK')
  return true

}

/**
 * Process Automatic Payments for one contract
 *
 * Steps:
 * - Automatic Payments validations
 * - Calculate payment value using QoS, Measures Data, Payment Frecuency & Discount
 * - Call SC to do payment
 * - Log the Transaction for Record-Keeping
 * - Save payment in bdd
 * - Save discount applied in payment
 * - Send email about automatic payment creation
 *
 * @param contract
 * @param user
 * @returns true/false
 */
const automaticPaymentByContract = async (automaticPaymentContract: AutomaticPaymentContractType, user: User): Promise<boolean> => {
  try {
    if (!await contractIsValidForAutomaticPayment(automaticPaymentContract, user)) 
      return false

    const paymentReiceverId = automaticPaymentContract.payment_receiver_id
    const paymentReceiverUser = (await User.query()
      .where('id', paymentReiceverId || '')
      .first()) as User

    // Call SC to do payment
    const currency = (await Currency.query().where('id', automaticPaymentContract.currency_id).first()) as Currency
    const trxHash = await smartContractPayment(
      automaticPaymentContract.contract_id.toString(),
      currency.contractAddress,
      automaticPaymentContract.payment_amount,
      paymentReceiverUser?.walletAddress || ''
    )

    // Save transacton in bdd
    const data: BlockchainTransactionCreation = {
      id: 0,
      userId: user.id,
      contractId: automaticPaymentContract.contract_id,
      walletAddress: user.walletAddress || '',
      networkId: parseInt(process.env.WEB3_NETWORK_ID || '0', 10),
      networkName: SUPPORTED_NETWORKS[ENV_SUPPORTED_NETWORK_ID].label || '',
      transactionType: 'Automatic Payment',
      transactionHash: trxHash.hash,
      status: trxHash.status,
      createdAt: DateTime.fromJSDate(new Date())
    }
    await service.createBlockchainTransaction(data)


    // Save payment in bdd
    const paymentData: CreatePaymentData = {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      description: 'automatic payment',
      amount: automaticPaymentContract.payment_amount,
      status: PaymentStatus.Paid,
      contractId: automaticPaymentContract.contract_id.toString(),
      discount: automaticPaymentContract.payment_discount,
      isVerified: true,
      dateFrom: automaticPaymentContract.payment_date_from,
      dateTo: automaticPaymentContract.payment_date_to
    }
    // create payment and send notifications (inside createPayment)
    await paymentSerivce.createPayment(paymentData, user)

    return true
  } catch (error) {
    console.error(error)
    const msg = 
      `Error ${error.message} when try to creeate automatic 
      payment for automatic contract ${automaticPaymentContract.contract_name}.`
    await NotificationsService.createGenericAutomaticContractNotifications(msg)
    return false
  }
}

/**
 * Validations for cashback
 *
 * Check Currency in contract
 * Check contract End Date Against Current Date
 * Check that lastest wallet that fund contract has a record in bdd log
 * Check wallet balance (primary token)
 * Check Contract balance in SC
 *
 * @param contract
 * @param user
 * @returns true/false
 */
const contractIsValidForCashback = async (contract: Contract, user: User): Promise<boolean> => {
  try {
    // Check currency
    if (!checkCurrency(contract.currency)) {
      const msg = `Invalid contract currency to proceed with cashback in automatic contract ${contract.name}.`
      await notifyAutomaticError(msg, 'cashback: ')
      return false
    }

    // Check contract date with current date
    const currentDate = new Date()
    const contractDateTime = contract.endDate
    const contractDateOnly = new Date(
      contractDateTime.year,
      contractDateTime.month,
      contractDateTime.day
    )

    if (contractDateOnly.getUTCMilliseconds() > currentDate.getUTCMilliseconds()) {
      const msg = `Invalid contract period to proceed with cashback in automatic contract ${contract.name}.`
      await notifyAutomaticError(msg, 'cashback: ')
      return false
    }

    // Get wallets that made funds to contract from log
    const fundContractsTrxs = await service.listBlockchainTransactionsFundContracts(contract.id)
    const walletsAddresses = fundContractsTrxs.map((transaction) => transaction.walletAddress.toUpperCase)

    // Get last wallet that funded the contract from SC
    const lastWalletFundContract = await getLastFundInAddress(
      contract.id.toString(),
      contract.currency.contractAddress
    )

    // Check that lastest wallet has a record in bdd log
    if (!walletsAddresses.includes(lastWalletFundContract.toUpperCase)) {
      const msg = `Last Wallet address ${lastWalletFundContract} that found contract ${contract.name}, not found in log to return funds.`
      await notifyAutomaticError(msg, 'cashback: ')
      return false
    }

    // Check wallet balance (primary token)
    const balances = await getWalletBalance(user.walletAddress || '')
    // console.log('bcashback: wallet balance primary token', balances)
    if (balances[0].balance <= 0) {
      const msg = `The wallet ${
        user.walletAddress || ''
      } doesn\'t have enough funds to make transactions for automatic contract ${contract.name}.`
      await notifyAutomaticError(msg, 'cashback: ')
      return false
    }

  } catch (error) {
    const msg = `Error ${error.message} checking cashback conditions for automatic contract ${contract.name}.`
    await notifyAutomaticError(msg, 'cashback: ')
  }

  console.log('cashback: all validations OK')
  return true

}

/**
 * Contract Cashback
 *
 * Steps:
 * - Cashback validations
 * - Do cashback in SC
 * - Log the Transaction for Record-Keeping
 * - Save cashback in bdd contract
 * - Send Notification
 *
 * @param contract
 * @param user
 * @returns
 */
const cashbackByContract = async (contract: Contract, user: User): Promise<boolean> => {
  try {
    if (!await contractIsValidForCashback(contract, user)) return false

    // Get contract funds
    let contractAllFunds = await getAllContractFunds(
      contract.id.toString(),
      contract.currency.contractAddress
    )
    
    const haveFundsToReturn = contractAllFunds[0].totalFunds > contractAllFunds[0].payoutFunds
    if (haveFundsToReturn) {
      // Call caskback in SC
      const cashbackHash = await smartContractCashback(
        contract.id.toString(),
        contract.currency.contractAddress
      )

      // Save trx in log
      const data: BlockchainTransactionCreation = {
        id: 0,
        userId: user.id,
        contractId: contract.id,
        walletAddress: user.walletAddress || '',
        networkId: parseInt(process.env.WEB3_NETWORK_ID || '0', 10),
        networkName: SUPPORTED_NETWORKS[ENV_SUPPORTED_NETWORK_ID].label || '',
        transactionType: 'Cashback',
        transactionHash: cashbackHash.hash,
        status: cashbackHash.status,
        createdAt: DateTime.fromJSDate(new Date())
      }
      await service.createBlockchainTransaction(data)
    
      // Get caskback value
      if (cashbackHash.status === 1) {
        contractAllFunds = await getAllContractFunds(
          contract.id.toString(),
          contract.currency.contractAddress
        )

        // Save cashback in contract bdd
        contract.cashback = contractAllFunds[0].cashbackFunds
        contract.cashbackVerified = true
        contract.save()
      }

      // Send notification
      NotificationsService.createNotificationByOperation(
        NotificationSources.automaticContractCashback,
        contract.id.toString() || '0'
      )
      
    } else {
      console.info('cashback: nothing to return in cashback for contract', contract.name)
      contract.cashbackVerified = true
      contract.save()
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * Trigger automatic payments
 *
 * @returns true/fals
 */
const automaticPayments = async (user: User): Promise<boolean> => {
  try {
    const result = await Database.query().select('*').from('contracts_for_automatic_payments')
    const formattedResult = result as AutomaticPaymentContractType[]
  
    Promise.all(
      formattedResult.map((contract: AutomaticPaymentContractType) => {
        console.log('automatic payment contractId => ', contract.contract_id)
        automaticPaymentByContract(contract, user)
      })
    )

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * Trigger Automatic Contract Cashback
 *
 * @returns true/false
 */
const cashback = async (user: User): Promise<boolean> => {
  try {
    const cashbackContracts = await Contract.query()
      .whereIn('status', [ContractStatus.Expired, ContractStatus.Completed])
      .andWhere('automatic', true)
      .andWhere('cashbackVerified', false)
      .preload('currency')
    cashbackContracts.map(({ id }) => console.log('cashback contractId => ', id))

    Promise.all(
      cashbackContracts.map((contract) => {
        cashbackByContract(contract, user)
      })
    )

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

// just for dev 
const dummyAutomaticPayment = async (contractId: number): Promise<boolean> => {
  const user = await userSerivce.getGigaSchedulerUser()
  const result = await Database.query()
    .select('*')
    .from('contracts_for_automatic_payments')
    .where('contract_id', contractId)
  const formattedResult = result as AutomaticPaymentContractType[]

  Promise.all(
    formattedResult.map((AutomaticPaymentConditionsType) => {
      console.log('automatic payment contractId => ', AutomaticPaymentConditionsType.contract_id)
      automaticPaymentByContract(AutomaticPaymentConditionsType, user)
    })
  )

  return true
}

// just for dev 
const dummyCashback = async (contractId: number): Promise<boolean> => {
  const user = await userSerivce.getGigaSchedulerUser()
  const contract = (await Contract.query()
    .where('id', contractId)
    .preload('currency')
    .first()) as Contract
  return await cashbackByContract(contract, user)
}

export default {
  automaticPayments,
  cashback,
  dummyCashback,
  dummyAutomaticPayment
}
