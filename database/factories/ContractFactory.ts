import Contract from 'App/Models/Contract'
import Factory from '@ioc:Adonis/Lucid/Factory'

import CountryFactory from './CountryFactory'
import CurrencyFactory from './CurrencyFactory'
import FrequencyFactory from './FrequencyFactory'
import IspFactory from './IspFactory'
import SchoolFactory from './SchoolFactory'
import ExpectedMetricFactory from './ExpectedMetricFactory'
import PaymentFactory from './PaymentFactory'
import AttachmentFactory from './AttachmentFactory'

import { DateTime } from 'luxon'

export default Factory.define(Contract, ({ faker }) => {
  return {
    name: faker.internet.domainWord(),
    governmentBehalf: false,
    budget: '10000',
    startDate: DateTime.now(),
    endDate: DateTime.fromJSDate(new Date(new Date().valueOf() + 86400000)),
    status: 1,
  }
})
  .relation('country', () => CountryFactory)
  .relation('currency', () => CurrencyFactory)
  .relation('frequency', () => FrequencyFactory)
  .relation('schools', () => SchoolFactory)
  .relation('isp', () => IspFactory)
  .relation('expectedMetrics', () => ExpectedMetricFactory)
  .relation('payments', () => PaymentFactory)
  .relation('attachments', () => AttachmentFactory)
  .build()
