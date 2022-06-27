import Lta from 'App/Models/Lta'
import Factory from '@ioc:Adonis/Lucid/Factory'

import CountryFactory from './CountryFactory'
import IspFactory from './IspFactory'

export default Factory.define(Lta, ({ faker }) => {
  return {
    name: faker.company.companyName(),
  }
})
  .relation('country', () => CountryFactory)
  .relation('isps', () => IspFactory)
  .build()
