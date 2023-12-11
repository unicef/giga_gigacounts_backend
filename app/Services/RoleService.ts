import Role from 'App/Models/Role'
import dto, { GetRole } from 'App/DTOs/Role'

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

const getRoles = async(): Promise<GetRole[]> => {
  const roles = await Role.query()
                  .where("internal_use", false)
                  .whereNotIn("code", ["GIGA.SUPER.ADMIN", "GIGA.VIEW.ONLY"])

  return dto.getRolesByRoleDTO(roles)
}

export default {
  getRolesPermission,
  getRoles
}
