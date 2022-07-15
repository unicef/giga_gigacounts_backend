import Currency from 'App/Models/Currency'
import Factory from '@ioc:Adonis/Lucid/Factory'

import { Faker } from '@faker-js/faker'

let fake: Faker

export default Factory.define(Currency, ({ faker }) => {
  fake = faker
  return {
    name: 'US Dollar',
  }
})
  .state('random', (currency) => (currency.name = fake.name.firstName()))
  .build()
