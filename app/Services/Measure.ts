import Measure from 'App/Models/Measure'
import { DateTime } from 'luxon'
import { DateTime as DateTimeLBD } from 'luxon-business-days'

import { MeasurementsData } from 'App/Helpers/unicefApi'
import Metric from 'App/Models/Metric'
import utils from 'App/Helpers/utils'
import { LoadMeasuresType } from 'App/Services/Contract'

const saveMeasuresFromUnicef = (
  measures: MeasurementsData[],
  contractId: number,
  schoolId: number,
  metrics: Metric[],
  startDate: DateTime,
  endDate: DateTime,
  type: LoadMeasuresType
) => {
  const uptime = calculateUptime(
    startDate,
    endDate,
    measures.map((measure) => measure['timestamp'])
  )
  const filteredMeasures = type === 'daily' ? filterMeasures(measures, endDate) : measures
  return Promise.all(
    filteredMeasures.map((measure) => {
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
          value: uptime,
          createdAt: DateTime.fromJSDate(new Date(measure['timestamp'])),
        },
      ])
    })
  )
}

const filterMeasures = (measures: MeasurementsData[], endDate: DateTime) => {
  return measures.filter(
    (measure) =>
      DateTime.fromJSDate(new Date(measure['timestamp'])).toFormat('yyyy-MM-dd') ===
      endDate.toFormat('yyyy-MM-dd')
  )
}

const calculateUptime = (start: DateTime, end: DateTime, measuresTimestamps: string[]) => {
  const startLBD = new DateTimeLBD(start)
  const endLBD = new DateTimeLBD(end)
  const businessDays = utils.businessDiff(startLBD, endLBD)
  const countOfTimestamps = utils.removeDuplicateTimestamps(measuresTimestamps).length
  return (countOfTimestamps / businessDays) * 100
}

export default {
  saveMeasuresFromUnicef,
}
