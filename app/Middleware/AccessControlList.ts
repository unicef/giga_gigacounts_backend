import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AccessControlList {
  public async handle(
    { auth, request, response }: HttpContextContract,
    next: () => Promise<void>,
    attr: string[]
  ) {
    if (!auth.user || !auth.user.approved) {
      return response.status(401).send({ message: 'Unauthorized' });
    }

    const permissions = request.permissions

    if (permissions && permissions.length > 0) {
      if (!attr.every((v) => permissions.indexOf(v) >= 0)) {
        return response.status(401).send({ message: 'Unauthorized' })
      }
    }

    await next()
  }
}
