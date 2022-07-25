import Measure from 'App/Models/Measure'

import { MeasurementsData } from 'App/Helpers/unicefApi'
import Metric from 'App/Models/Metric'
import { DateTime } from 'luxon'

const saveMeasuresFromUnicef = (
  measures: MeasurementsData[],
  contractId: number,
  schoolId: number,
  metrics: Metric[]
) => {
  return Promise.all(
    measures.map((measure) => {
      Measure.createMany([
        {
          contractId,
          schoolId,
          metricId: metrics.find((m) => m.name === 'Latency')?.id,
          value: parseFloat(measure['latency']),
          createdAt: DateTime.fromJSDate(new Date(measure['timestamp'])),
        },
        {
          contractId,
          schoolId,
          metricId: metrics.find((m) => m.name === 'Download speed')?.id,
          value: measure['download'],
          createdAt: DateTime.fromJSDate(new Date(measure['timestamp'])),
        },
        {
          contractId,
          schoolId,
          metricId: metrics.find((m) => m.name === 'Upload speed')?.id,
          value: measure['upload'],
          createdAt: DateTime.fromJSDate(new Date(measure['timestamp'])),
        },
        {
          contractId,
          schoolId,
          metricId: metrics.find((m) => m.name === 'Uptime')?.id,
          value: 0,
          createdAt: DateTime.fromJSDate(new Date(measure['timestamp'])),
        },
      ])
    })
  )
}

export default {
  saveMeasuresFromUnicef,
}
