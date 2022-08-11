import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/Measure'

export default class MeasuresController {
  public async calculateMeasuresByMonthYear({ response, request }: HttpContextContract) {
    const { contractId, month, year } = request.body()
    const measures = await service.calculateMeasuresByMonthYear({ contractId, month, year })
    response.ok(measures)
  }
}
