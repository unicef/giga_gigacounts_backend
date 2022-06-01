import Role from 'App/Models/Role'
import Factory from '@ioc:Adonis/Lucid/Factory'

import { roles } from 'App/Helpers/constants'
import PermissionFactory from './PermissionFactory'

export default Factory.define(Role, () => {
  return {
    name: roles.countryOffice,
  }
})
  .relation('permissions', () => PermissionFactory)
  .build()
