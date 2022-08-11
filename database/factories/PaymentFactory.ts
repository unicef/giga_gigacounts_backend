import Payment from 'App/Models/Payment'
import Factory from '@ioc:Adonis/Lucid/Factory'

import { DateTime } from 'luxon'

import ContractFactory from './ContractFactory'
import CurrencyFactory from './CurrencyFactory'
import UserFactory from './UserFactory'

export default Factory.define(Payment, () => {
  return {
    dateFrom: DateTime.now(),
    dateTo: DateTime.now(),
    isVerified: true,
    description: 'description of the payment',
    amount: 1000,
  }
})
  .relation('currency', () => CurrencyFactory)
  .relation('contract', () => ContractFactory)
  .relation('creator', () => UserFactory)
  .build()
