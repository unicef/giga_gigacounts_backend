import Role from "App/Models/Role"

export interface GetRole {
    code: string
    name: string
}

const getRoleDTO = (role: Role): GetRole => ({
    code: role.code,
    name: role.name,
})

const getRolesByRoleDTO = (roles : Role[]): GetRole[] => {
    return roles.map(getRoleDTO)
}

export default {
    getRolesByRoleDTO,
}
