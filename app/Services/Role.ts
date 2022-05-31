import Role from 'App/Models/Role'

const getRolesPermission = async (roles: Role[]): Promise<string[]> => {
  const permissions = await Promise.all(
    roles.map(async (r) => {
      await r.load('permissions')
      return r.permissions?.map((p) => p.name)
    })
  )
  return [].concat.apply([], permissions)
}

export default {
  getRolesPermission,
}
