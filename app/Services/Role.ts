import Role from 'App/Models/Role'

const getRolesPermission = async (roles: Role[]): Promise<string[]> => {
  const permissions = await Promise.all(
    roles.map(async (r) => {
      await r.load('permissions')
      return r.permissions?.map((p) => p.name)
    })
  )

  // Set = to remove duplicated permissions
  return [].concat.apply([], ...new Set(permissions))
}

export default {
  getRolesPermission
}
