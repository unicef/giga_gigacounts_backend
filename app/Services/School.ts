import Database from '@ioc:Adonis/Lucid/Database'

import School from 'App/Models/School'
import unicefApi from 'App/Helpers/unicefApi'
import Metric from 'App/Models/Metric'
import measureService from 'App/Services/Measure'

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
  startDate: string
  endDate: string
  metrics: Metric[]
  countryCode: string
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
  startDate: string,
  endDate: string
) => {
  const metrics = await Metric.all()

  return Promise.all(
    schoolIds.map((schoolId) =>
      loadSchoolMeasure({ schoolId, contractId, startDate, endDate, metrics, countryCode })
    )
  )
}

const loadSchoolMeasure = async ({
  schoolId,
  contractId,
  startDate,
  endDate,
  metrics,
  countryCode,
}: LoadSchoolsMeasuresData) => {
  const school = await School.find(schoolId)
  if (!school || !school.externalId) return

  const measures = await unicefApi.allMeasurementsBySchool({
    country_code: countryCode,
    school_id: school.externalId,
    start_date: startDate,
    end_date: endDate,
    size: 50,
  })

  return measureService.saveMeasuresFromUnicef(measures, contractId, school.id, metrics)
}

export default {
  listSchoolByCountry,
  getSchoolsMeasures,
  loadSchoolsMeasures,
}
