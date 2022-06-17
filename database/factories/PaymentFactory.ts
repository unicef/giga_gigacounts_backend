import Payment from 'App/Models/Payment'
import Factory from '@ioc:Adonis/Lucid/Factory'

import { DateTime } from 'luxon'

import ContractFactory from './ContractFactory'
import CurrencyFactory from './CurrencyFactory'

export default Factory.define(Payment, () => {
  return {
    dueDate: DateTime.now(),
    paidDate: DateTime.now(),
    isVerified: true,
  }
})
  .relation('currency', () => CurrencyFactory)
  .relation('contract', () => ContractFactory)
  .build()
