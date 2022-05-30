import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { roles } from 'App/Helpers/constants'
import service from 'App/Services/User'

export default class AccessControlList {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>, attr: string[]) {
    if (!auth.user?.roles.some((v) => [roles.gigaAdmin].indexOf(v.name) >= 0)) {
      const roles = auth.user?.roles
    }

    await next()
  }
}
