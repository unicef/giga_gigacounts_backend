import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/MetricService'

export default class MetricsController {
  public async listMetricsSuggestedValues({ response }: HttpContextContract) {
    const metrics = await service.listMetricsSuggestedValues()
    return response.ok(metrics)
  }
}
