import { Exception } from '@adonisjs/core/build/standalone'
export default class NotFoundException extends Exception {
  constructor(message?: string, status?: number, code?: string) {
    super(message || 'Not Found', status || 404, code || 'NOT_FOUND')
  }
}
