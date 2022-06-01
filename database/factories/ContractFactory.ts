import Contract from 'App/Models/Contract'
import Factory from '@ioc:Adonis/Lucid/Factory'

import CountryFactory from './CountryFactory'
import CurrencyFactory from './CurrencyFactory'
import FrequencyFactory from './FrequencyFactory'
import IspFactory from './IspFactory'
import { DateTime } from 'luxon'

export default Factory.define(Contract, ({ faker }) => {
  return {
    name: faker.internet.domainWord(),
    governmentBehalf: false,
    budget: '1000',
    startDate: DateTime.now(),
    endDate: DateTime.now(),
    status: 0,
  }
})
  .relation('country', () => CountryFactory)
  .relation('currency', () => CurrencyFactory)
  .relation('frequency', () => FrequencyFactory)
  .relation('isp', () => IspFactory)
  .build()
