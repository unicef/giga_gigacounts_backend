import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import roleService from 'App/Services/Role'

export default class AccessControlList {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    attr: string[]
  ) {
    if (!auth.user) return response.status(401).send({ message: 'Unauthorized' })
    const permissions = await roleService.getRolesPermission(auth.user?.roles)
    if (!attr.every((v) => permissions.indexOf(v) >= 0)) {
      return response.status(401).send({ message: 'Unauthorized' })
    }
    await next()
  }
}
