import Role from 'App/Models/Role'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Faker } from '@faker-js/faker'

import { roles } from 'App/Helpers/constants'
import PermissionFactory from './PermissionFactory'

let fake: Faker

export default Factory.define(Role, ({ faker }) => {
  fake = faker
  return {
    name: roles.countryOffice,
  }
})
  .relation('permissions', () => PermissionFactory)
  .state('random', (role) => (role.name = fake.name.firstName()))
  .build()
