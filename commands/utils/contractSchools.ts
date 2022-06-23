import { DateTime } from 'luxon'

import { ContractStatus } from 'App/Helpers/constants'
import Contract from 'App/Models/Contract'
import School from 'App/Models/School'
import Attachment from 'App/Models/Attachment'
import Draft from 'App/Models/Draft'

export const createContracts = async (
  countryId: number,
  currencyId: number,
  frequencyId: number,
  userId: number,
  ispId: number,
  ltas: number[],
  schools: School[],
  metricsId: number[],
  isp2Id: number
) => {
  const attachment = await Attachment.create({ url: 'www.url.com ' })
  await Contract.firstOrCreate(
    generateContracts(
      '43341171',
      countryId,
      currencyId,
      frequencyId,
      userId,
      ContractStatus.Ongoing,
      isp2Id,
      ltas[0]
    )
  ).then((ctc) => {
    ctc.related('schools').saveMany([schools[0], schools[1], schools[2], schools[3], schools[4]])
    ctc
      .related('payments')
      .create(generatePayments(500000, attachment.id, ctc.id, userId, currencyId))
    ctc.related('expectedMetrics').createMany(generateExpectedMetrics(ctc.id, metricsId))
    return ctc
  })
  await Contract.firstOrCreate(
    generateContracts(
      '23315657',
      countryId,
      currencyId,
      frequencyId,
      userId,
      ContractStatus.Sent,
      ispId,
      ltas[0]
    )
  ).then((ctc) => {
    ctc.related('schools').saveMany([schools[5], schools[6]])
    ctc.related('expectedMetrics').createMany(generateExpectedMetrics(ctc.id, metricsId))
    return ctc
  })
  await Contract.firstOrCreate(
    generateContracts(
      '33315657',
      countryId,
      currencyId,
      frequencyId,
      userId,
      ContractStatus.Confirmed,
      ispId,
      ltas[0]
    )
  ).then((ctc) => {
    ctc.related('schools').saveMany([schools[7]])
    ctc.related('expectedMetrics').createMany(generateExpectedMetrics(ctc.id, metricsId))
    return ctc
  })
  // //
  await Draft.firstOrCreate({
    name: '43316557',
    ltaId: ltas[1],
  })
  await Contract.firstOrCreate(
    generateContracts(
      '53315657',
      countryId,
      currencyId,
      frequencyId,
      userId,
      ContractStatus.Expired,
      ispId,
      ltas[1]
    )
  ).then((ctc) => {
    ctc.related('schools').saveMany([schools[8], schools[9]])
    ctc
      .related('payments')
      .create(generatePayments(1000000, attachment.id, ctc.id, userId, currencyId))
    ctc.related('expectedMetrics').createMany(generateExpectedMetrics(ctc.id, metricsId))
    return ctc
  })
  await Contract.firstOrCreate(
    generateContracts(
      '63315657',
      countryId,
      currencyId,
      frequencyId,
      userId,
      ContractStatus.Completed,
      ispId,
      ltas[1]
    )
  ).then((ctc) => {
    ctc.related('schools').saveMany([schools[10]])
    ctc
      .related('payments')
      .create(generatePayments(1000000, attachment.id, ctc.id, userId, currencyId))
    ctc.related('expectedMetrics').createMany(generateExpectedMetrics(ctc.id, metricsId))
    return ctc
  })
  //
  await Contract.firstOrCreate(
    generateContracts(
      '73315657',
      countryId,
      currencyId,
      frequencyId,
      userId,
      ContractStatus.Ongoing,
      ispId
    )
  ).then((ctc) => {
    ctc.related('schools').saveMany([schools[11], schools[12]])
    ctc
      .related('payments')
      .create(generatePayments(1000, attachment.id, ctc.id, userId, currencyId))
    ctc.related('expectedMetrics').createMany(generateExpectedMetrics(ctc.id, metricsId))
    return ctc
  })
  await Contract.firstOrCreate(
    generateContracts(
      '83315657',
      countryId,
      currencyId,
      frequencyId,
      userId,
      ContractStatus.Ongoing,
      ispId
    )
  ).then((ctc) => {
    ctc.related('schools').saveMany([schools[13], schools[14]])
    ctc
      .related('payments')
      .create(generatePayments(900000, attachment.id, ctc.id, userId, currencyId))
    ctc.related('expectedMetrics').createMany(generateExpectedMetrics(ctc.id, metricsId))
    return ctc
  })
  await Draft.firstOrCreate({
    name: '93315657',
    schools: { schools: [{ id: schools[15].id }] },
  })
}

export const createSchools = async (countryId: number, metricsId: number[]) => {
  const school1 = await School.firstOrCreate(generateSchool('School 1', countryId)).then(
    (school) => {
      school.related('measures').createMany(generateGreenMeasures(school.id, metricsId))
      return school
    }
  )
  const school2 = await School.firstOrCreate(generateSchool('School 2', countryId)).then(
    (school) => {
      school.related('measures').createMany(generateGreenMeasures(school.id, metricsId))
      return school
    }
  )
  const school3 = await School.firstOrCreate(generateSchool('School 3', countryId)).then(
    (school) => {
      school.related('measures').createMany(generateOrangeMeasures(school.id, metricsId))
      return school
    }
  )
  const school4 = await School.firstOrCreate(generateSchool('School 4', countryId)).then(
    (school) => {
      school.related('measures').createMany(generateOrangeMeasures(school.id, metricsId))
      return school
    }
  )
  const school5 = await School.firstOrCreate(generateSchool('School 5', countryId))
  const school6 = await School.firstOrCreate(generateSchool('School 6', countryId))
  const school7 = await School.firstOrCreate(generateSchool('School 7', countryId))
  const school8 = await School.firstOrCreate(generateSchool('School 8', countryId))
  const school9 = await School.firstOrCreate(generateSchool('School 9', countryId)).then(
    (school) => {
      school.related('measures').createMany(generateGreenMeasures(school.id, metricsId))
      return school
    }
  )
  const school10 = await School.firstOrCreate(generateSchool('School 10', countryId)).then(
    (school) => {
      school.related('measures').createMany(generateGreenMeasures(school.id, metricsId))
      return school
    }
  )
  const school11 = await School.firstOrCreate(generateSchool('School 11', countryId)).then(
    (school) => {
      school.related('measures').createMany(generateGreenMeasures(school.id, metricsId))
      return school
    }
  )
  const school12 = await School.firstOrCreate(generateSchool('School 12', countryId)).then(
    (school) => {
      school.related('measures').createMany(generateGreenMeasures(school.id, metricsId))
      return school
    }
  )
  const school13 = await School.firstOrCreate(generateSchool('School 13', countryId)).then(
    (school) => {
      school.related('measures').createMany(generateOrangeMeasures(school.id, metricsId))
      return school
    }
  )
  const school14 = await School.firstOrCreate(generateSchool('School 14', countryId)).then(
    (school) => {
      school.related('measures').createMany(generateOrangeMeasures(school.id, metricsId))
      return school
    }
  )
  const school15 = await School.firstOrCreate(generateSchool('School 15', countryId))
  const school16 = await School.firstOrCreate(generateSchool('School 16', countryId))
  return [
    school1,
    school2,
    school3,
    school4,
    school5,
    school6,
    school7,
    school8,
    school9,
    school10,
    school11,
    school12,
    school13,
    school14,
    school15,
    school16,
  ]
}

const generateContracts = (
  name: string,
  countryId: number,
  currencyId: number,
  frequencyId: number,
  userId: number,
  status: ContractStatus,
  ispId?: number,
  ltaId?: number
) => ({
  countryId,
  governmentBehalf: false,
  name,
  currencyId: currencyId,
  budget: '1000000',
  frequencyId: frequencyId,
  startDate: DateTime.now(),
  endDate: DateTime.now(),
  ...(ispId ? { ispId: ispId } : {}),
  createdBy: userId,
  status,
  ...(ltaId ? { ltaId: ltaId } : {}),
})

const generatePayments = (
  amount: number,
  invoiceId: number,
  contractId: number,
  userId: number,
  currencyId: number
) => ({
  dueDate: DateTime.now(),
  paidDate: DateTime.now(),
  invoiceId,
  contractId,
  paidBy: userId,
  amount,
  currencyId,
})

const generateSchool = (name: string, countryId: number) => ({
  name,
  externalId: 1001,
  address: 'None Street',
  location1: 'Location 1',
  location2: 'Location 2',
  location3: 'Location 3',
  location4: 'Location 4',
  educationLevel: 'High school',
  geopoint: '10.32424, 5.84978',
  email: 'school1@school.com',
  phoneNumber: '(123) 1111-1111',
  contactPerson: 'School Owner',
  countryId,
})

const generateExpectedMetrics = (contractId: number, metricsId: number[]) => {
  return [
    {
      metricId: metricsId[0],
      value: 100,
      contractId,
    },
    {
      metricId: metricsId[1],
      value: 5,
      contractId,
    },
    {
      metricId: metricsId[2],
      value: 10,
      contractId,
    },
    {
      metricId: metricsId[3],
      value: 5,
      contractId,
    },
  ]
}

const generateGreenMeasures = (schoolId: number, metricsId: number[]) => {
  return [
    {
      metricId: metricsId[0],
      value: 100,
      schoolId: schoolId,
    },
    {
      metricId: metricsId[1],
      value: 5,
      schoolId: schoolId,
    },
    {
      metricId: metricsId[2],
      value: 10,
      schoolId: schoolId,
    },
    {
      metricId: metricsId[3],
      value: 5,
      schoolId: schoolId,
    },
  ]
}

const generateOrangeMeasures = (schoolId: number, metricsId: number[]) => {
  return [
    {
      metricId: metricsId[0],
      value: 90,
      schoolId: schoolId,
    },
    {
      metricId: metricsId[1],
      value: 5,
      schoolId: schoolId,
    },
    {
      metricId: metricsId[2],
      value: 8,
      schoolId: schoolId,
    },
    {
      metricId: metricsId[3],
      value: 5,
      schoolId: schoolId,
    },
  ]
}
