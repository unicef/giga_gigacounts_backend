import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

import CountryFactory from './CountryFactory'
import RoleFactory from './RoleFactory'

export default Factory.define(User, ({ faker }) => {
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: '123456',
    isAdmin: false,
  }
})
  .relation('roles', () => RoleFactory)
  .relation('country', () => CountryFactory)
  .build()
