import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import User from 'App/Models/User'

import service from 'App/Services/UserService'
import roleService from 'App/Services/RoleService'

export default class UsersController {
  public async profile({ auth, response }: HttpContextContract) {
    if (!auth.user) return

    const user = await service.getProfile(auth.user)

    if (!user) throw new NotFoundException('User not found')

    return response.ok(user)
  }

  public async register({ request, response }: HttpContextContract) {
    const { country, email, givenName } = request.all()

    try {
      const unapprovedUser = await service.register(country, email, givenName)

      return response.ok(unapprovedUser)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async approve({request, response}: HttpContextContract) {
    const { unapprovedUserId, roleCode, ispId } = request.all()

    const user = await service.approve(unapprovedUserId, roleCode, ispId)

    return response.ok(user)
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const { email, password } = request.all()
      const user = (await User.query().where('email', email).first()) as User

      if (!user) throw new NotFoundException('User not found')

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
      const token = await auth.use('api').attempt(email, password, { payload })

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

  public async gigaTokenWalletOwnerAddress({ response, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const walletAddress = await service.gigaTokenWalletOwnerAddress()
      return response.ok(walletAddress)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async getPermissionsByEmail({ response, request }: HttpContextContract) {
    try {
      const { email } = request.body()
      const { permissions, userId, countryId } = await service.getPermissionsByEmail(email)

      return response.ok({
        version: '1.0.0',
        action: 'Continue',
        extension_Permissions: permissions.join(','),
        extension_UserId: Number(userId),
        extension_CountryId: Number(countryId)
      })
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

  public async listUsers({ response, request, auth }: HttpContextContract) {
    if (!auth.user) return
    const { countryId, roles, ispId, externalUsers } = request.qs()
    let rolesToSearch: string[] = []

    if (roles) {
      rolesToSearch = roles.split(',')
    }

    const users = await service.listUsers(
      auth.user,
      Boolean(Number(externalUsers)),
      countryId,
      rolesToSearch,
      ispId
    )
    return response.ok(users)
  }

  public async listUnapprovedUsers({ response, auth }: HttpContextContract) {
    if (!auth.user) return

    try {
      const users = await service.listUnapprovedUsers(auth.user)
      return response.ok(users)
    } catch(error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async unapprovedUserChange({ request, response, auth }: HttpContextContract) {
    if (!auth.user || auth.user.approved) return
    const { roleCode, ispId } = request.all()

    try {
      const user = await service.unapprovedUserChange(auth.user, roleCode, ispId)
      return response.ok(user)
    } catch(error) {
      return response.status(error.status).send(error.message)
    }
  }
}
