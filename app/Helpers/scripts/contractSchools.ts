import { DateTime } from 'luxon'

import { ContractStatus } from 'App/Helpers/constants'
import Contract from 'App/Models/Contract'
import School from 'App/Models/School'
import Attachment from 'App/Models/Attachment'
import Draft from 'App/Models/Draft'

type GenerateMetric = (
  schoolId: number,
  metricsId: number[],
  contractId: number
) => {
  metricId: number
  value: number
  schoolId: number
  contractId: number
}[]

export const createContracts = async (
  countryId: number,
  currencyId: number,
  frequencyId: number,
  userId: number,
  ispId: number,
  ltas: number[],
  metricsId: number[],
  isp2Id: number
) => {
  const attachment = await Attachment.create({ url: 'www.url.com', name: 'Attachment' })
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
  ).then(async (ctc) => {
    ctc
      .related('schools')
      .saveMany([
        await createSchool('School 1', countryId, metricsId, ctc.id, generateGreenMeasures),
        await createSchool('School 2', countryId, metricsId, ctc.id, generateGreenMeasures),
        await createSchool('School 3', countryId, metricsId, ctc.id, generateOrangeMeasures),
        await createSchool('School 4', countryId, metricsId, ctc.id, generateOrangeMeasures),
        await createSchool('School 5', countryId, metricsId, ctc.id),
      ])
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
  ).then(async (ctc) => {
    ctc
      .related('schools')
      .saveMany([
        await createSchool('School 6', countryId, metricsId, ctc.id),
        await createSchool('School 7', countryId, metricsId, ctc.id),
      ])
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
  ).then(async (ctc) => {
    ctc.related('schools').saveMany([await createSchool('School 8', countryId, metricsId, ctc.id)])
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
  ).then(async (ctc) => {
    ctc
      .related('schools')
      .saveMany([
        await createSchool('School 9', countryId, metricsId, ctc.id, generateGreenMeasures),
        await createSchool('School 10', countryId, metricsId, ctc.id, generateGreenMeasures),
      ])
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
  ).then(async (ctc) => {
    ctc
      .related('schools')
      .saveMany([
        await createSchool('School 11', countryId, metricsId, ctc.id, generateGreenMeasures),
      ])
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
  ).then(async (ctc) => {
    ctc
      .related('schools')
      .saveMany([
        await createSchool('School 12', countryId, metricsId, ctc.id, generateGreenMeasures),
        await createSchool('School 13', countryId, metricsId, ctc.id, generateOrangeMeasures),
      ])
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
  ).then(async (ctc) => {
    ctc
      .related('schools')
      .saveMany([
        await createSchool('School 14', countryId, metricsId, ctc.id, generateOrangeMeasures),
        await createSchool('School 15', countryId, metricsId, ctc.id),
      ])
    ctc
      .related('payments')
      .create(generatePayments(900000, attachment.id, ctc.id, userId, currencyId))
    ctc.related('expectedMetrics').createMany(generateExpectedMetrics(ctc.id, metricsId))
    return ctc
  })
  const school16 = await createSchool('School 16', countryId, metricsId)
  await Draft.firstOrCreate({
    name: '93315657',
    schools: { schools: [{ id: school16.id }] },
  })
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
  startDate: DateTime.now().set({ hour: 0, minute: 0, second: 0 }),
  endDate: DateTime.fromJSDate(new Date(new Date().valueOf() + 86400000)),
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
  externalId: '1001',
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

const generateGreenMeasures = (schoolId: number, metricsId: number[], contractId: number) => {
  return [
    {
      metricId: metricsId[0],
      value: 100,
      schoolId: schoolId,
      contractId: contractId,
    },
    {
      metricId: metricsId[1],
      value: 5,
      schoolId: schoolId,
      contractId: contractId,
    },
    {
      metricId: metricsId[2],
      value: 10,
      schoolId: schoolId,
      contractId: contractId,
    },
    {
      metricId: metricsId[3],
      value: 5,
      schoolId: schoolId,
      contractId: contractId,
    },
  ]
}

const generateOrangeMeasures = (schoolId: number, metricsId: number[], contractId: number) => {
  return [
    {
      metricId: metricsId[0],
      value: 90,
      schoolId: schoolId,
      contractId: contractId,
    },
    {
      metricId: metricsId[1],
      value: 5,
      schoolId: schoolId,
      contractId: contractId,
    },
    {
      metricId: metricsId[2],
      value: 8,
      schoolId: schoolId,
      contractId: contractId,
    },
    {
      metricId: metricsId[3],
      value: 5,
      schoolId: schoolId,
      contractId: contractId,
    },
  ]
}

const createSchool = async (
  name: string,
  countryId: number,
  metricsId: number[],
  contractId?: number,
  generateMetric?: GenerateMetric
) => {
  return School.firstOrCreate(generateSchool(name, countryId)).then((school) => {
    if (generateMetric && contractId) {
      school.related('measures').createMany(generateMetric(school.id, metricsId, contractId))
    }
    return school
  })
}
