import Lta from 'App/Models/Lta'
import Factory from '@ioc:Adonis/Lucid/Factory'

import CountryFactory from './CountryFactory'

export default Factory.define(Lta, ({ faker }) => {
  return {
    name: faker.company.companyName(),
  }
})
  .relation('country', () => CountryFactory)
  .build()
