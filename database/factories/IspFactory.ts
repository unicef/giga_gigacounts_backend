import Isp from 'App/Models/Isp'
import Factory from '@ioc:Adonis/Lucid/Factory'

import CountryFactory from './CountryFactory'
import LtaFactory from './LtaFactory'

export default Factory.define(Isp, () => {
  return {
    name: 'T-Mobile',
  }
})
  .relation('country', () => CountryFactory)
  .relation('ltas', () => LtaFactory)
  .build()
