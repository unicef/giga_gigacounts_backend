import { Exception } from '@adonisjs/core/build/standalone'

export default class DatabaseException extends Exception {
  constructor(message?: string, status?: number, code?: string) {
    super(message || 'Database error', status || 424, code || 'DATABASE_ERROR')
  }
}
