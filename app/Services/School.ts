import Database from '@ioc:Adonis/Lucid/Database'

import School from 'App/Models/School'

export type TimeInterval = 'day' | 'week' | 'month'

export interface SchoolMeasure {
  date: string
  metric_name: string
  unit: string
  median_value: number
}

const getSchoolsMeasures = async (
  schoolId: number,
  contractId: number,
  interval: TimeInterval
): Promise<SchoolMeasure[]> => {
  const measures = await Database.rawQuery(
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

export default {
  listSchoolByCountry,
  getSchoolsMeasures,
}
