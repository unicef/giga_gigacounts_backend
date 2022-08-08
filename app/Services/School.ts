import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import School from 'App/Models/School'
import unicefApi from 'App/Helpers/unicefApi'
import Metric from 'App/Models/Metric'
import measureService from 'App/Services/Measure'

import utils from 'App/Helpers/utils'
import { LoadMeasuresType } from './Contract'

export type TimeInterval = 'day' | 'week' | 'month'

export interface SchoolMeasure {
  date: string
  metric_name: string
  unit: string
  median_value: number
}

interface LoadSchoolsMeasuresData {
  contractId: number
  schoolId: number
  startDate: DateTime
  endDate: DateTime
  metrics: Metric[]
  countryCode: string
  type: LoadMeasuresType
}

const getSchoolsMeasures = async (
  schoolId: number,
  contractId: number,
  interval: TimeInterval
): Promise<SchoolMeasure[]> => {
  const measures = await Database.rawQuery(
    // eslint-disable-next-line max-len
    'SELECT date_trunc(?, measures.created_at) date, metrics.name as metric_name, metrics.unit as unit, PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) as median_value from measures INNER JOIN metrics ON metrics.id=metric_id where school_id = ? and contract_id = ? group by metric_id, date, metric_name, unit order by 1',
    [interval, schoolId, contractId]
  )

  return measures.rows as SchoolMeasure[]
}

const listSchoolByCountry = async (countryId?: number): Promise<School[]> => {
  const query = School.query()
  if (countryId) query.where('country_id', countryId)
  return query
}

const loadSchoolsMeasures = async (
  schoolIds: number[],
  contractId: number,
  countryCode: string,
  startDate: DateTime,
  endDate: DateTime,
  metrics: Metric[],
  type: LoadMeasuresType
) => {
  const chunks = utils.splitIntoChunks(schoolIds, 50) as number[][]
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map((schoolId) =>
        loadSchoolMeasure({ schoolId, contractId, startDate, endDate, metrics, countryCode, type })
      )
    )
  }
}

const loadSchoolMeasure = async ({
  schoolId,
  contractId,
  startDate,
  endDate,
  metrics,
  countryCode,
  type,
}: LoadSchoolsMeasuresData) => {
  const school = await School.find(schoolId)
  if (!school || !school.externalId) return
  /**
   * THE DATE IS DECREASE HERE BECAUSE IT WAS INCREASE IN THE LAST STEP
   * INCREASED DATE HAS IMPACT WHEN CALCULATING MONTH DIFFERENCE
   */
  const diffMonths = utils.diffOfMonths(
    endDate.minus({ day: 1 }).startOf('month'),
    startDate.startOf('month')
  ) || { months: 0 }

  if (diffMonths.months >= 1) {
    let condition = true
    let monthDate = startDate

    while (condition) {
      if (monthDate.get('month') <= endDate.get('month')) {
        const { firstDay, lastDay } = utils.getFirstAndLastDaysMonth(monthDate)
        await loadAndSaveMeasures(
          school,
          countryCode,
          isSameMonth(monthDate, startDate) ? startDate : firstDay,
          lastDay,
          metrics,
          contractId,
          type
        )
        monthDate = monthDate.plus({ month: 1 })
      } else {
        condition = false
      }
    }
    return
  }

  return loadAndSaveMeasures(school, countryCode, startDate, endDate, metrics, contractId, type)
}

const loadAndSaveMeasures = async (
  school: School,
  countryCode: string,
  startDate: DateTime,
  endDate: DateTime,
  metrics: Metric[],
  contractId: number,
  type: LoadMeasuresType
) => {
  const measures = await unicefApi.allMeasurementsBySchool({
    country_code: countryCode,
    school_id: school.externalId,
    start_date: startDate.toFormat('yyyy-MM-dd').toString(),
    end_date: endDate.toFormat('yyyy-MM-dd').toString(),
    size: 50,
  })

  return measureService.saveMeasuresFromUnicef(
    measures,
    contractId,
    school.id,
    metrics,
    startDate,
    endDate,
    type
  )
}

const isSameMonth = (currentDate: DateTime, startDate: DateTime) =>
  currentDate.get('month') === startDate.get('month')

export default {
  listSchoolByCountry,
  getSchoolsMeasures,
  loadSchoolsMeasures,
}
