import Country from 'App/Models/Country'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Faker } from '@faker-js/faker'

let fake: Faker

export default Factory.define(Country, ({ faker }) => {
  fake = faker
  return {
    name: 'Testland',
    code: 'TTD',
    flagUrl: 'www.testland.com/flag',
  }
})
  .state('random', (country) => (country.name = fake.name.firstName()))
  .build()
