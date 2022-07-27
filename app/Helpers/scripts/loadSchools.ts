import School from 'App/Models/School'
import unicefApi from 'App/Helpers//unicefApi'

import Country from 'App/Models/Country'

const brazilId = 144
const botswanaId = 201

interface UnicefSchool {
  id: number
  school_id: string
  name: string
  address: string
  postal_code: string
  email: string
  education_level: string
  environment: string
  school_type: string
  country_id: number
  country: string
  location_id: number
  admin_2_name: string
  admin_3_name: string
  admin_4_name: string
  admin_1_name: string
  giga_id_school: string
}

export const loadSchools = async () => {
  try {
    const brazil = await Country.findBy('name', 'Brazil')
    const botswana = await Country.findBy('name', 'Botswana')
    if (brazil && botswana) {
      await Promise.all([fetchSchools(brazilId, brazil.id), fetchSchools(botswanaId, botswana.id)])
    }
  } catch (error) {
    console.log(error)
  }
}

const fetchSchools = async (countryGigaId: number, countryId: number) => {
  const condition = true
  let page = 0
  const size = 50
  while (condition) {
    page++
    const result = await unicefApi.getSchools(countryGigaId, page, size)

    if (result.data.data.length > 0) {
      /* LOG FOR WHEN RUNNING */
      // console.log({ length: result.data?.data?.length, page, country: countryId })
      await Promise.all(
        result.data?.data.map((school: UnicefSchool) => createSchool(school, countryId))
      )
    } else {
      break
    }
  }
}

const createSchool = (school: UnicefSchool, countryId: number) => {
  const externalId = school.school_id || school.id.toString()
  return School.firstOrCreate(
    { externalId },
    {
      externalId,
      name: school.name,
      address: school.address,
      location1: school.admin_1_name,
      location2: school.admin_2_name,
      location3: school.admin_3_name,
      location4: school.admin_4_name,
      educationLevel: school.education_level,
      email: school.email,
      gigaIdSchool: school.giga_id_school,
      countryId,
    }
  )
}
