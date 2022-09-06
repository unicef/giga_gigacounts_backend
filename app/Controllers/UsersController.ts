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

  public async generateWalletRandomString({ response, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const randomString = await service.generateWalletRandomString(auth.user)
      return response.ok(randomString)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
