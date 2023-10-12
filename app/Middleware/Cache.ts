import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NodeCache from 'node-cache'

const cache = new NodeCache()
export default class CacheMiddleware {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>,
    routeTTL: number
  ) {
    const getTTL = (ttl) => {
      let TTLResult = 10 * 60 // 10 minutes
      try {
        if (ttl) TTLResult = parseInt(ttl[0])
      } catch (ex) {
        console.error('TTL in route error: ', ex)
      }
      return TTLResult
    }

    try {
      const key = `cache-${request.url().replace('/', '')}`
      const cachedResponse = cache.get(key)

      if (cachedResponse) {
        response.send(cachedResponse)
      } else {
        const originalSend = response.send
        response.send = (body: any) => {
          const ttl = getTTL(routeTTL)
          cache.set(key, body, ttl)
          originalSend.call(response, body)
        }
      }
    } catch (ex) {
      console.error('cache error:', ex.message)
    }
    await next()
  }
}
