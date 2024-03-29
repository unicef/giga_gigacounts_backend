import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
// import { DateTime as DateTimeLBD } from 'luxon-business-days'

import NotFoundException from 'App/Exceptions/NotFoundException'

import Measure from 'App/Models/Measure'
import Metric from 'App/Models/Metric'
import Contract from 'App/Models/Contract'

import utils from 'App/Helpers/utils'
import { LoadMeasuresType } from 'App/Services/ContractService'
import { MeasurementsData } from 'App/Helpers/unicefApi'
import dto from 'App/DTOs/Measure'
import { Metrics } from 'App/Helpers/constants'
import { frequencyNames } from '../Helpers/constants'

export interface CalculatebyMonthYearData {
  contractId: number
  month: number
  year: number
}

const calculateMeasuresByMonthYear = async ({
  contractId,
  month,
  year
}: CalculatebyMonthYearData) => {
  const contract = (await Contract.query()
    .where('id', contractId)
    .preload('schools')
    .preload('expectedMetrics')
    .withCount('schools')) as Contract[]
  if (!contract.length) throw new NotFoundException('Contract not found')
  const { dateFrom, dateTo } = utils.makeFromAndToDate(
    frequencyNames.Monthly,
    month,
    year,
    contract[0].endDate,
    contract[0].startDate
  )

  const schoolsMedians = await getSchoolsMedianMeasures(contract, dateFrom, dateTo)

  const connectionsMedian = await Database.rawQuery(
    `SELECT contract_id, metric_id, Metrics.name as metric_name, Metrics.unit as unit, PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) as median_value
      from Measures
      INNER JOIN Metrics ON Metrics.id = metric_id
      WHERE Measures.created_at BETWEEN ? AND ? AND contract_id = ?
      GROUP BY contract_id, metric_id, metric_name, unit
    `,
    [dateFrom.toSQL()!, dateTo.toSQL()!, contract[0].id]
  )

  return dto.calculateMeasuresDTO(contract[0], schoolsMedians, connectionsMedian.rows)
}

const saveMeasuresFromUnicef = (
  measures: MeasurementsData[],
  contractId: number,
  schoolId: number,
  metrics: Metric[],
  // startDate: DateTime,
  endDate: DateTime,
  type: LoadMeasuresType
) => {
  // THE DATE IS DECREASE HERE TO GET THE REAL DATE IF IS DAILY
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _endDate = type === 'daily' ? endDate.minus({ day: 1 }) : endDate

  // const uptime = calculateUptime(
  //   startDate,
  //   _endDate,
  //   measures.map((measure) => measure['timestamp'])
  // )

  const filteredMeasures = type === 'daily' ? filterMeasures(measures, _endDate) : measures
  const promises = filteredMeasures.map(async (measure) => {
    const existingMeasure = await Measure.query()
      .where('school_id', schoolId)
      .andWhere('createdAt', DateTime.fromJSDate(new Date(measure['timestamp'])).toSQL()!)
      .first()

    if (!existingMeasure) {
      await Measure.createMany([
        {
          contractId,
          schoolId,
          metricId: metrics.find((m) => m.name.toLowerCase() === Metrics.Latency.toLowerCase())?.id,
          value: parseFloat(measure['latency']),
          createdAt: DateTime.fromJSDate(new Date(measure['timestamp']))
        },
        {
          contractId,
          schoolId,
          metricId: metrics.find((m) => m.name.toLowerCase() === Metrics.Download.toLowerCase())
            ?.id,
          value: convertKilobitsToMegabits(measure['download']),
          createdAt: DateTime.fromJSDate(new Date(measure['timestamp']))
        },
        {
          contractId,
          schoolId,
          metricId: metrics.find((m) => m.name.toLowerCase() === Metrics.Upload.toLowerCase())?.id,
          value: convertKilobitsToMegabits(measure['upload']),
          createdAt: DateTime.fromJSDate(new Date(measure['timestamp']))
        },
        {
          contractId,
          schoolId,
          metricId: metrics.find((m) => m.name.toLowerCase() === Metrics.Uptime.toLowerCase())?.id,
          value: 0,
          createdAt: DateTime.fromJSDate(new Date(measure['timestamp']))
        }
      ])
    }
  })

  return Promise.all(promises)
}

const filterMeasures = (measures: MeasurementsData[], endDate: DateTime) => {
  return measures.filter(
    (measure) =>
      DateTime.fromJSDate(new Date(measure['timestamp'])).toFormat('yyyy-MM-dd') ===
      endDate.toFormat('yyyy-MM-dd')
  )
}

// const calculateUptime = (start: DateTime, end: DateTime, measuresTimestamps: string[]) => {
//   const startLBD = new DateTimeLBD(start)
//   const endLBD = new DateTimeLBD(end)
//   const businessDays = utils.businessDiff(startLBD, endLBD)
//   const countOfTimestamps = utils.removeDuplicateTimestamps(measuresTimestamps).length
//   return Math.round((countOfTimestamps / businessDays) * 100)
// }

const convertKilobitsToMegabits = (value: number) => (value > 0 ? Math.round(value / 1000) : 0)

const getSchoolsMedianMeasures = async (
  contracts: Contract[],
  dateFrom: DateTime,
  dateTo: DateTime
) => {
  const schoolsMedians = {}

  for (const contract of contracts) {
    if (!contract.schools?.length) continue
    schoolsMedians[contract.name] = {}
    for (const school of contract.schools) {
      const measure = await Database.rawQuery(
        // eslint-disable-next-line max-len
        `SELECT contract_id, metric_id, Metrics.name as metric_name, Metrics.unit as unit, Measures.school_id,
                        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) as median_value
             from Measures INNER JOIN Metrics ON Metrics.id = metric_id
             WHERE Measures.created_at BETWEEN ? AND ?
               AND contract_id = ?
               AND school_id = ?
             GROUP BY contract_id, metric_id, metric_name, unit, school_id`,
        [dateFrom.toSQL()!, dateTo.toSQL()!, contract.id, school.id]
      )
      schoolsMedians[contract.name][school.name] = measure.rows
    }
  }
  return schoolsMedians
}

export default {
  saveMeasuresFromUnicef,
  calculateMeasuresByMonthYear
}
