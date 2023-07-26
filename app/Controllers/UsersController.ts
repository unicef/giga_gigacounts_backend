import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import User from 'App/Models/User'

import service from 'App/Services/User'
import roleService from 'App/Services/Role'

export default class UsersController {
  public async profile({ auth, response }: HttpContextContract) {
    const user = await service.getProfile(auth.user)
    return response.ok(user)
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const { email, password } = request.all()
      const user = (await User.query().where('email', email).first()) as User

      if (!user) throw new NotFoundException('User not found', 404, 'NOT_FOUND')

      const permissions = await roleService.getRolesPermission(user.roles)

      // In Bdd: Allow for the possibility that the user may have more than one role.
      const rolesDataToPayload = user.roles.map(({ code, name }) => ({ code, name }))

      // to frontend: just return the first role
      const payload = {
        role: {
          code: rolesDataToPayload[0].code,
          name: rolesDataToPayload[0].name,
          permissions: permissions
        }
      }
      const token = await auth.use('jwt').attempt(email, password, { payload })

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

  public async attachWallet({ response, auth, request }: HttpContextContract) {
    try {
      if (!auth.user) return
      const { message, address } = request.all()
      const user = await service.attachWallet({ user: auth.user, address, message })
      return response.ok(user)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async getPermissionsByEmail({ response, request }: HttpContextContract) {
    try {
      const { email } = request.body()
      const user = await service.getPermissionsByEmail(email)
      return response.ok(user)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async updateSettingAutomaticContracts({ response, auth, request }: HttpContextContract) {
    try {
      if (!auth.user) return
      const { automaticContractsEnabled } = request.all()
      const result = await service.updateSettingAutomaticContracts(
        auth.user,
        automaticContractsEnabled
      )
      return response.ok(result)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
