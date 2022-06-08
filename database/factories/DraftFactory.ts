import Draft from 'App/Models/Draft'
import Factory from '@ioc:Adonis/Lucid/Factory'

import CountryFactory from './CountryFactory'
import CurrencyFactory from './CurrencyFactory'
import FrequencyFactory from './FrequencyFactory'
import IspFactory from './IspFactory'

export default Factory.define(Draft, ({ faker }) => {
  return {
    name: faker.name.firstName(),
  }
})
  .relation('country', () => CountryFactory)
  .relation('currency', () => CurrencyFactory)
  .relation('frequency', () => FrequencyFactory)
  .relation('isp', () => IspFactory)
  .build()
