import Database from '@ioc:Adonis/Lucid/Database'
import { roles } from 'App/Helpers/constants'
import User from 'App/Models/User'
import userService from 'App/Services/User'

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
}

const listDashboardSchools = async (user: User):  Promise<DashboardSchools[]> => {
  let rawQuery = `
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
    (SELECT avg(value) as avg_uspeed from measures where school_id = sc.id and metric_id = 4) as avg_uspeed
  FROM schools sc`

  if (!userService.checkUserRole(user, [roles.gigaAdmin, roles.gigaViewOnly])) {
    rawQuery += ' where country_id = ' + user.countryId.toString()
  }

  const query = await Database.rawQuery(rawQuery)
  return query.rows as DashboardSchools[]
}


export default {
  listDashboardSchools
}
