import Permission from 'App/Models/Permission'
import { permissions } from 'App/Helpers/constants'

export const createPermissions = () => {
  return Promise.all(
    Object.keys(permissions).map((key) => {
      return Permission.create({ name: permissions[key] })
    })
  )
}
