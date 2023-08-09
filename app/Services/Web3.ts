// import Database from "@ioc:Adonis/Lucid/Database"
import User from "App/Models/User"

const automaticPayments = async (user: User): Promise<boolean> => {
  // const trx = await Database.transaction()
  try {

    // TODO: get ongoging Contracts

    // TODO: payment receiver setted?, notif Acc, CM

    // TODO: payment receiver has a wallet?, notif, Acc, CM, Payment receiver

    // TODO: calculate payment value using QoS, Measures Data, Payment Frecuency

    // TODO: the contract has sufficient funds, notif Acc, CM

    // TODO: Get Wallet PK from environment

    // TODO: Call SC to do payment

    // TODO: Save transacton in bdd 

    // TODO: Save payment in bdd

    // TODO: send email de payment receiver, ACC, CM

    return true

  } catch (error) {
    console.log(error)
    return false
  }
}

const cashback = async (user: User): Promise<boolean> => {
  // const trx = await Database.transaction()
  try {

    // TODO: get expired and closed contracts

    // TODO: Calculate caskback

    // TODO: Call SC to return cashback

    // TODO: Save cashback in bdd

    // TODO: Save transaction log

    // TODO: Send notification to Acc, CM

    return true

  } catch (error) {
    console.log(error)
    return false
  }
}


export default {
  automaticPayments,
  cashback
}
