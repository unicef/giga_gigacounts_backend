import Role from 'App/Models/Role'
import { roles } from 'App/Helpers/constants'
import Permission from 'App/Models/Permission'

export const createRoles = async (permissions: Permission[]) => {
  const countryOffice = await Role.firstOrCreate({ name: roles.countryOffice }).then((role) => {
    role.related('permissions').saveMany(permissions)
    return role
  })
  const government = await Role.firstOrCreate({ name: roles.government }).then((role) => {
    role.related('permissions').saveMany(permissions)
    return role
  })
  const admin = await Role.firstOrCreate({ name: roles.gigaAdmin }).then((role) => {
    role.related('permissions').saveMany(permissions)
    return role
  })
  const isp = await Role.firstOrCreate({ name: roles.isp }).then((role) => {
    role
      .related('permissions')
      .saveMany(permissions.filter((perm) => perm.name !== 'contract.write'))
    return role
  })
  return [countryOffice, government, admin, isp]
}
