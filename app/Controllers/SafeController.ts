import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Safe'

export default class SafeController {
  public async test() {
    try {
      await service.initialize()
    } catch (error) {
      console.log(error)
    }
  }
}
