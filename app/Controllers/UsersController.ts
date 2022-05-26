import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App//Services/User'

export default class UsersController {
  public async profile({ auth, response }: HttpContextContract) {
    const user = await service.getProfile(auth.user)
    return response.ok(user)
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const { email, password } = request.all()
      const token = await auth.use('api').attempt(email, password)
      return response.ok(token)
    } catch (error) {
      return response.badRequest({ errors: [{ message: 'Wrong email or password' }] })
    }
  }
}
