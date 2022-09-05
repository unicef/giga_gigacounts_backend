import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

import CountryFactory from './CountryFactory'
import RoleFactory from './RoleFactory'
import SafeFactory from './SafeFactory'
import IspFactory from './IspFactory'

export default Factory.define(User, ({ faker }) => {
  return {
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: '123456',
  }
})
  .relation('roles', () => RoleFactory)
  .relation('country', () => CountryFactory)
  .relation('safe', () => SafeFactory)
  .relation('isp', () => IspFactory)
  .build()
