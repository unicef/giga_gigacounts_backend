import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App//Services/User'

export default class UsersController {
  public async profile({ auth, response }: HttpContextContract) {
    const user = await service.getProfile(auth.user)
    return response.ok(user)
  }
}
