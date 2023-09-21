import { GuardsList } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import validate from 'App/Helpers/jwt'
import User from 'App/Models/User'

/**
 * Auth middleware is meant to restrict un-authenticated access to a given route
 * or a group of routes.
 *
 * You must register this middleware inside `start/kernel.ts` file under the list
 * of named middleware.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to when request is Unauthorized
   */
  protected redirectTo = '/login'

  /**
   * Authenticates the current HTTP request against a custom set of defined
   * guards.
   *
   * The authentication loop stops as soon as the user is authenticated using any
   * of the mentioned guards and that guard will be used by the rest of the code
   * during the current request.
   */
  protected async authenticate(auth: HttpContextContract['auth'], guards: (keyof GuardsList)[]) {
    /**
     * Hold reference to the guard last attempted within the for loop. We pass
     * the reference of the guard to the "AuthenticationException", so that
     * it can decide the correct response behavior based upon the guard
     * driver
     */
    let guardLastAttempted: string | undefined

    for (let guard of guards) {
      guardLastAttempted = guard

      if (await auth.use(guard).check()) {
        /**
         * Instruct auth to use the given guard as the default guard for
         * the rest of the request, since the user authenticated
         * succeeded here
         */
        auth.defaultGuard = guard
        return true
      }
    }

    /**
     * Unable to authenticate using any guard
     */
    throw new AuthenticationException(
      'Unauthorized access',
      'E_UNAUTHORIZED_ACCESS',
      guardLastAttempted,
      this.redirectTo
    )
  }

  /**
   * Handle request
   */
  public async handle({ request, response, auth }: HttpContextContract, next: () => Promise<void>) {
    const authHeader = request.headers().authorization
    if (authHeader) {
      try {
        const tenantName = process.env.TENANT_NAME || ''
        const policyName = process.env.POLICY_NAME || ''
        const tenantId = process.env.TENANT_ID || ''
        const applicationId = process.env.APPLICATION_ID || ''

        const token = authHeader.split(' ')[1]
        const decodedToken = await validate(token, {
          tenantId,
          tenantName,
          policyName,
          applicationId
        })

        const user = (await User.findBy(
          'id',
          decodedToken.payload.extension_UserId as number
        )) as User

        // user.name = decodedToken.payload.given_name as string
        // user.id = decodedToken.payload.extension_UserId as number

        await auth.use('api').generate(user)
        request.permissions = decodedToken.payload.extension_Permissions as string[]
      } catch (error) {
        console.log(error)
        response.unauthorized({
          error: 'Unable to decode B2C JWT Token'
        })
      }
    } else {
      response.unauthorized({
        error: 'Missing Authorization header'
      })
    }

    /**
     * Uses the user defined guards or the default guard mentioned in
     * the config file
     */
    //const guards = customGuards.length ? customGuards : [auth.name]
    //await this.authenticate(auth, guards)
    await next()
  }
}
