import { Exception } from '@adonisjs/core/build/standalone'

export default class UnAuthorizedException extends Exception {
  constructor(message?: string, status?: number, code?: string) {
    super(
      message || 'The current user does not have the required permissions to do this action',
      status || 401,
      code || 'E_UNAUTHORIZED_ACCESS'
    )
  }
}
