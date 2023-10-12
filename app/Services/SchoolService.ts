import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import School from 'App/Models/School'
import User from 'App/Models/User'
import unicefApi from 'App/Helpers/unicefApi'
import Metric from 'App/Models/Metric'
import measureService from 'App/Services/MeasureService'
import userService from 'App/Services/UserService'

import utils from 'App/Helpers/utils'
import { LoadMeasuresType } from './ContractService'
import { roles } from 'App/Helpers/constants'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Contract from 'App/Models/Contract'
import Measure from 'App/Models/Measure'
import DTOContract from 'App/DTOs/Contract'
import dto from 'App/DTOs/School'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

export type TimeInterval = 'day' | 'week' | 'month'

export interface SchoolMeasure {
  date: string
  metric_name: string
  unit: string
  median_value: number
  contract_id?: number
  school_external_id?: string
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
  interval: TimeInterval,
  dateFrom: string,
  dateTo: string
): Promise<SchoolMeasure[]> => {
  let sqlQuery = `
    SELECT date_trunc(?, measures.created_at) date,
    measures.id as measure_id,
    measures.contract_id as contract_id,
    metrics.name as metric_name,
    schools.name as school_name,
    schools.external_id as school_external_id,
    schools.education_level as school_education_level,
    schools.location_1 as school_location1,
    metrics.unit as unit,
    contracts.name as contract_name,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) as median_value
    from measures
    INNER JOIN metrics ON metrics.id = metric_id
    INNER JOIN contracts ON contracts.id = measures.contract_id
    INNER JOIN schools ON schools.id = measures.school_id
    where school_id = ?`

  const params: (number | string)[] = [interval, schoolId]

  sqlQuery += ' AND measures.created_at BETWEEN ? AND ?'
  params.push(dateFrom, dateTo)

  sqlQuery += ` GROUP BY measures.metric_id, measure_id, date, school_name, school_education_level, 
      school_external_id, school_location1, contract_id, contract_name, metric_name, unit
      ORDER BY contract_id`

  const measures = await Database.rawQuery(sqlQuery, params)
  return addConnectionField(measures.rows as SchoolMeasure[])
}

const addConnectionField = async (measures: SchoolMeasure[]): Promise<SchoolMeasure[]> => {
  const updatedMeasures = await Promise.all(
    measures.map(async (measure) => {
      const school = (await School.findBy('external_id', measure.school_external_id)) as School
      const contract = (await Contract.findBy('id', measure.contract_id)) as Contract
      const schoolMeasures = {}

      await contract.load('expectedMetrics')
      schoolMeasures[contract.name] = {}
      schoolMeasures[contract.name][school.name] = await Measure.query()
        .avg('value')
        .where('school_id', school.id)
        .andWhere('contract_id', contract.id)
        .select('metric_id')
        .groupBy('metric_id')

      if (contract.expectedMetrics) {
        return {
          ...measure,
          connection: await DTOContract.calculateSchoolsMeasure(
            schoolMeasures[contract.name][school.name],
            contract.expectedMetrics
          )
        }
      } else {
        return {
          ...measure
        }
      }
    })
  )

  return updatedMeasures
}

const listSchoolsPagination = async (
  user: User,
  page = 1,
  limit = 10,
  countryId?: number
): Promise<ModelPaginatorContract<School>> => {
  const query = School.query()

  if (
    await userService.checkUserRole(user, [
      roles.countryContractCreator,
      roles.countryAccountant,
      roles.countrySuperAdmin,
      roles.countryMonitor
    ])
  ) {
    countryId = user.countryId
  }

  if (countryId) {
    query.where('country_id', countryId)
  }

  const schools = await query.paginate(page, limit)

  return schools
}

const searchSchoolsByExternalId = async (
  user: User,
  externalIds: string[],
  countryId?: number
): Promise<Object[]> => {
  const query = School.query()

  if (
    await userService.checkUserRole(user, [
      roles.countryContractCreator,
      roles.countryAccountant,
      roles.countrySuperAdmin,
      roles.countryMonitor
    ])
  ) {
    countryId = user.countryId
  }

  if (countryId) {
    query.where('country_id', countryId).whereIn('externalId', externalIds)
  } else {
    query.whereIn('externalId', externalIds)
  }

  const schools = await query.select([]).exec()

  const foundExternalIds = schools.map((school) => school.externalId)
  const notFoundExternalIds = externalIds.filter((id) => !foundExternalIds.includes(id))

  return dto.schoolsCSVDTO(schools, notFoundExternalIds)
}

const searchSchools = async (
  user: User,
  toSearch: string,
  countryId?: number
): Promise<School[]> => {
  const query = School.query()
  toSearch = toSearch.replace(/%20/g, ' ')

  if (
    await userService.checkUserRole(user, [
      roles.countryContractCreator,
      roles.countryAccountant,
      roles.countrySuperAdmin,
      roles.countryMonitor
    ])
  ) {
    countryId = user.countryId
  }

  if (countryId) {
    query.where('country_id', countryId)
  }

  query.where(function (builder) {
    builder
      .orWhereRaw('LOWER(name) LIKE ?', [`%${toSearch.toLowerCase()}%`])
      .orWhereRaw('LOWER(external_id) LIKE ?', [`%${toSearch.toLowerCase()}%`])
  })

  const schools = await query.select().exec()

  return schools
}

const updateSchoolReliableMeasures = async (
  schoolId: number,
  reliableMeasures: boolean
): Promise<School[]> => {
  try {
    const school = await School.query()
      .where('id', schoolId)
      .update({ reliable_measures: reliableMeasures })

    if (!school.length) {
      throw new NotFoundException('School not found')
    }

    return school[0]
  } catch (error) {
    throw error
  }
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
  type
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
    size: 20
  })

  return measureService.saveMeasuresFromUnicef(
    measures,
    contractId,
    school.id,
    metrics,
    endDate,
    type
  )
}

const isSameMonth = (currentDate: DateTime, startDate: DateTime) =>
  currentDate.get('month') === startDate.get('month')

export default {
  listSchoolsPagination,
  searchSchoolsByExternalId,
  searchSchools,
  updateSchoolReliableMeasures,
  getSchoolsMeasures,
  loadSchoolsMeasures
}
