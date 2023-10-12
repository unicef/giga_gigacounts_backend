import Database from '@ioc:Adonis/Lucid/Database'
import { roles } from 'App/Helpers/constants'
import Contract from 'App/Models/Contract'
import User from 'App/Models/User'
import userService from 'App/Services/UserService'
import dto from 'App/DTOs/Dashboard'
import DatabaseException from 'App/Exceptions/DatabaseException'

export interface DashboardSchools {
  id: number
  external_id: string
  name: string
  address: string
  education_level: string
  country_id: number
  lat: string
  lng: string
  avg_uptime: number
  avg_latency: number
  avg_dspeed: number
  avg_uspeed: number
  connectivity_issues: boolean
}

export interface DahsboardNotMetSLA {
  contract_id: string
  sla_complience: string
}

const listDashboardSchools = async (
  user: User,
  countryId?: number
): Promise<DashboardSchools[]> => {
  let rawQuery = `
  WITH MetricValidity AS (
    SELECT
        m.contract_id,
        m.school_id,
        em.metric_id,
        CASE
            WHEN em.metric_id = 2 THEN
                CASE
                    WHEN AVG(m.value) >= MAX(em.value) THEN TRUE
                    ELSE FALSE
                END
            ELSE
                CASE
                    WHEN AVG(m.value) >= MAX(em.value) THEN FALSE
                    ELSE TRUE
                END
        END AS connectivity_issue
    FROM
        measures m
    JOIN
        expected_metrics em ON m.contract_id = em.contract_id AND m.metric_id = em.metric_id
    GROUP BY
        m.contract_id, m.school_id, em.metric_id
  )
  
  SELECT
      sc.id,
      sc.external_id,
      sc.name,
      sc.address,
      sc.education_level,
      sc.country_id,
      (string_to_array(geopoint, ','))[1] AS lat,
      (string_to_array(geopoint, ','))[2] AS lng,
      (SELECT avg(value) as avg_uptime from measures where school_id = sc.id and metric_id = 1) as avg_uptime,
      (SELECT avg(value) as avg_latency from measures where school_id = sc.id and metric_id = 2) as avg_latency,
      (SELECT avg(value) as avg_dspeed from measures where school_id = sc.id and metric_id = 3) as avg_dspeed,
      (SELECT avg(value) as avg_uspeed from measures where school_id = sc.id and metric_id = 4) as avg_uspeed,
      CASE
          WHEN SUM(CASE WHEN mv.connectivity_issue = TRUE THEN 1 ELSE 0 END) > 0 THEN TRUE
          ELSE FALSE
      END AS connectivity_issues
  FROM
      MetricValidity mv
  JOIN
      schools sc ON mv.school_id = sc.id
  `

  try {
    const isAdmin = await userService.checkUserRole(user, [roles.gigaAdmin, roles.gigaViewOnly])

    if (isAdmin) {
      const targetCountryId = countryId || user.countryId
      rawQuery += ' WHERE sc.country_id = ' + targetCountryId
    } else {
      rawQuery += ' WHERE sc.country_id = ' + user.countryId
    }

    rawQuery +=
      ' GROUP BY sc.id, sc.external_id, sc.name, sc.address, sc.education_level, sc.country_id, lat, lng'
    const query = await Database.rawQuery(rawQuery)
    const schools = (await query.rows) as DashboardSchools[]
    return schools
  } catch (ex) {
    console.error(ex)
    throw new DatabaseException('Some database error occurred while getting notifications')
  }
}

const listNotMeetsSla = async (user: User, countryId?: number) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const formattedDate = `${year}${month.toString().padStart(2, '0')}${day
    .toString()
    .padStart(2, '0')}`

  const contractListNotMeetsSLA: Contract[] = []
  const isAdmin = await userService.checkUserRole(user, [roles.gigaAdmin, roles.gigaViewOnly])
  const targetCountryId = isAdmin && countryId !== undefined ? countryId : user.countryId

  let rawQuery = `
      WITH contract_sla_ranked AS (
        SELECT
            c.id AS contract_id,
            CASE
                WHEN EXISTS (
                    SELECT 1
                    FROM expected_metrics em
                    JOIN measures m ON em.contract_id = m.contract_id
                                  AND em.metric_id = m.metric_id
                                  AND TO_CHAR(m.created_at, 'YYYYMMDD') = '${formattedDate}'
                    WHERE em.contract_id = c.id
                      AND (
                          (em.metric_id = 2 AND m.value > em.value) OR
                          (em.metric_id = 3 AND m.value < em.value)
                      )
                ) THEN false
                ELSE true
            END AS sla_compliance,
            ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY s.id) AS contract_row_number
        FROM
            school_contracts sc
            JOIN contracts c ON sc.contract_id = c.id
            JOIN schools s ON sc.school_id = s.id
        )
        SELECT contract_id, sla_compliance
        FROM contract_sla_ranked
        WHERE contract_row_number = 1 AND contract_id IN (SELECT id FROM contracts WHERE country_id = ${targetCountryId});
    `

  try {
    const query = await Database.rawQuery(rawQuery)
    for (const c of query.rows) {
      if (!c.sla_compliance) {
        const contract = await Contract.query()
          .where('id', c.contract_id)
          .preload('isp')
          .preload('schools')
        contractListNotMeetsSLA.push(contract[0])
      }
    }
    return dto.dashboardContractListDTO(contractListNotMeetsSLA)
  } catch (ex) {
    console.error(ex)
    throw new DatabaseException('Some database error occurred while getting notifications')
  }
}

export default {
  listDashboardSchools,
  listNotMeetsSla
}
