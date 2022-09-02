import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import gnosisSafe from 'App/Helpers/gnosisSafe'

export default class SafeController {
  public async test() {
    try {
      return gnosisSafe.getSafeBalance('0xf79D6002b66aCcd9f4382E55a66ddc08f8708a45')
    } catch (error) {
      console.log(error)
    }
  }
}
