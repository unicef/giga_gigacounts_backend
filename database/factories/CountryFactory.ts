import Country from 'App/Models/Country'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Country, () => {
  return {
    name: 'Testland',
    code: 'TTD',
    flagUrl: 'www.testland.com/flag',
  }
}).build()
