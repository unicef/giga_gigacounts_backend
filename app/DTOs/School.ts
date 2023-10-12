import School from 'App/Models/School'

export interface SchoolCSV {
  external_id: string
  valid: boolean
  id?: number
  name?: string
  address?: string
  location1?: string
  location2?: string
  location3?: string
  location4?: string
  education_level?: string
  geopoint?: string
  email?: string
  phone_number?: string
  contract_person?: string
}

const schoolsCSVDTO = async (validSchools: School[], invalidIds: string[]) => {
  const schools: SchoolCSV[] = []

  validSchools.map((school) => {
    const schoolCSV = {
      external_id: school.externalId,
      valid: true,
      id: Number(school.id),
      name: school.name,
      address: school.address,
      location1: school.location1,
      location2: school.location2,
      location3: school.location3,
      location4: school.location4,
      education_level: school.educationLevel,
      geopoint: school.geopoint,
      email: school.email,
      phone_number: school.phoneNumber,
      contact_person: school.contactPerson
    }

    schools.push(schoolCSV)
  })

  invalidIds.map((invalidId) => {
    const schoolCSV = {
      external_id: invalidId,
      valid: false
    }

    schools.push(schoolCSV)
  })

  return schools
}

export default {
  schoolsCSVDTO
}
