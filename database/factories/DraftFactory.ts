import Draft from 'App/Models/Draft'
import Factory from '@ioc:Adonis/Lucid/Factory'

import CountryFactory from './CountryFactory'
import CurrencyFactory from './CurrencyFactory'
import FrequencyFactory from './FrequencyFactory'
import IspFactory from './IspFactory'
import AttachmentFactory from './AttachmentFactory'

export default Factory.define(Draft, ({ faker }) => {
  return {
    name: faker.company.companyName(),
  }
})
  .relation('country', () => CountryFactory)
  .relation('currency', () => CurrencyFactory)
  .relation('frequency', () => FrequencyFactory)
  .relation('isp', () => IspFactory)
  .relation('attachments', () => AttachmentFactory)
  .build()
