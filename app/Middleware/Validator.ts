import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import validators from 'App/Validators/index'

export default class Validator {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>, attr: string[]) {
    const validator = validators(attr[0]) as any
    if (validator) await request.validate(validator)
    await next()
  }
}
