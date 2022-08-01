import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import ContractFactory from 'Database/factories/ContractFactory'
import UserFactory from 'Database/factories/UserFactory'
import CountryFactory from 'Database/factories/CountryFactory'
import IspFactory from 'Database/factories/IspFactory'
import MetricFactory from 'Database/factories/MetricFactory'
import MeasureFactory from 'Database/factories/MeasureFactory'

import { SchoolMeasure } from 'App/Services/School'

test.group('Schools Measures', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully get all schools measures by day', async ({ client, expect }) => {
    const user = await setupUser()
    const contract = await createContract(user.countryId, user.id)
    const response = await client.post('/school/measures').loginAs(user).json({
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      interval: 'day',
    })
    const measures = response.body() as SchoolMeasure[]
    const distinctDates = measures
      .map((item) => item.date)
      .filter((value, index, self) => self.indexOf(value) === index)
    expect(measures.length).toBe(12)
    expect(distinctDates.length).toBe(3)
    for (const measure of measures) {
      if (measure.date === distinctDates[0]) {
        if (measure.metric_name === 'Uptime') expect(measure.median_value).toBe(90)
        if (measure.metric_name === 'Latency') expect(measure.median_value).toBe(8)
        if (measure.metric_name === 'Download speed') expect(measure.median_value).toBe(3)
        if (measure.metric_name === 'Upload speed') expect(measure.median_value).toBe(5)
      }
      if (measure.date === distinctDates[1]) {
        if (measure.metric_name === 'Uptime') expect(measure.median_value).toBe(100)
        if (measure.metric_name === 'Latency') expect(measure.median_value).toBe(10)
        if (measure.metric_name === 'Download speed') expect(measure.median_value).toBe(3)
        if (measure.metric_name === 'Upload speed') expect(measure.median_value).toBe(5)
      }
      if (measure.date === distinctDates[2]) {
        if (measure.metric_name === 'Uptime') expect(measure.median_value).toBe(100)
        if (measure.metric_name === 'Latency') expect(measure.median_value).toBe(10)
        if (measure.metric_name === 'Download speed') expect(measure.median_value).toBe(3)
        if (measure.metric_name === 'Upload speed') expect(measure.median_value).toBe(5)
      }
    }
  })
  test('Successfully get all schools measures by week', async ({ client, expect }) => {
    const user = await setupUser()
    const contract = await createContract(user.countryId, user.id)
    const response = await client.post('/school/measures').loginAs(user).json({
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      interval: 'week',
    })
    const measures = response.body() as SchoolMeasure[]
    const distinctDates = measures
      .map((item) => item.date)
      .filter((value, index, self) => self.indexOf(value) === index)
    expect(measures.length).toBe(12)
    expect(distinctDates.length).toBe(3)
    for (const measure of measures) {
      if (measure.date === distinctDates[0]) {
        if (measure.metric_name === 'Uptime') expect(measure.median_value).toBe(90)
        if (measure.metric_name === 'Latency') expect(measure.median_value).toBe(8)
        if (measure.metric_name === 'Download speed') expect(measure.median_value).toBe(3)
        if (measure.metric_name === 'Upload speed') expect(measure.median_value).toBe(5)
      }
      if (measure.date === distinctDates[1]) {
        if (measure.metric_name === 'Uptime') expect(measure.median_value).toBe(100)
        if (measure.metric_name === 'Latency') expect(measure.median_value).toBe(10)
        if (measure.metric_name === 'Download speed') expect(measure.median_value).toBe(3)
        if (measure.metric_name === 'Upload speed') expect(measure.median_value).toBe(5)
      }
      if (measure.date === distinctDates[2]) {
        if (measure.metric_name === 'Uptime') expect(measure.median_value).toBe(100)
        if (measure.metric_name === 'Latency') expect(measure.median_value).toBe(10)
        if (measure.metric_name === 'Download speed') expect(measure.median_value).toBe(3)
        if (measure.metric_name === 'Upload speed') expect(measure.median_value).toBe(5)
      }
    }
  })
  test('Successfully get all schools measures by month', async ({ client, expect }) => {
    const user = await setupUser()
    const contract = await createContract(user.countryId, user.id)
    const response = await client.post('/school/measures').loginAs(user).json({
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      interval: 'month',
    })
    const measures = response.body() as SchoolMeasure[]
    const distinctDates = measures
      .map((item) => item.date)
      .filter((value, index, self) => self.indexOf(value) === index)
    expect(measures.length).toBe(8)
    expect(distinctDates.length).toBe(2)
    for (const measure of measures) {
      if (measure.date === distinctDates[0]) {
        if (measure.metric_name === 'Uptime') expect(measure.median_value).toBe(95)
        if (measure.metric_name === 'Latency') expect(measure.median_value).toBe(9)
        if (measure.metric_name === 'Download speed') expect(measure.median_value).toBe(3)
        if (measure.metric_name === 'Upload speed') expect(measure.median_value).toBe(5)
      }
      if (measure.date === distinctDates[1]) {
        if (measure.metric_name === 'Uptime') expect(measure.median_value).toBe(100)
        if (measure.metric_name === 'Latency') expect(measure.median_value).toBe(10)
        if (measure.metric_name === 'Download speed') expect(measure.median_value).toBe(3)
        if (measure.metric_name === 'Upload speed') expect(measure.median_value).toBe(5)
      }
    }
  })
  test('Return empty array if school or contract doesnt exist', async ({ client, expect }) => {
    const user = await setupUser()
    await createContract(user.countryId, user.id)
    const response = await client.post('/school/measures').loginAs(user).json({
      schoolId: 1000,
      contractId: 32333,
      interval: 'month',
    })
    const measures = response.body() as SchoolMeasure[]
    expect(measures.length).toBe(0)
  })
  test('Throw a validation error if the body is wrong', async ({ client, expect }) => {
    const user = await setupUser()
    const contract = await createContract(user.countryId, user.id)
    const response = await client.post('/school/measures').loginAs(user).json({
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      interval: 'weekly',
    })
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe('enum validation failed')
    expect(JSON.parse(error.text).errors[0].field).toBe('interval')
    expect(JSON.parse(error.text).errors[0].rule).toBe('enum')
  })
})

const setupUser = async () => {
  const country = await CountryFactory.create()
  return UserFactory.merge({ countryId: country.id })
    .with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'school.read' }))
    )
    .create()
}

const createContract = async (countryId: number, userId: number) => {
  const isp = await IspFactory.merge({ name: 'Verizon' }).create()
  const metrics = await MetricFactory.merge([
    {
      name: 'Uptime',
    },
    {
      name: 'Latency',
    },
    {
      name: 'Download speed',
    },
    {
      name: 'Upload speed',
    },
  ]).createMany(4)
  const contract = await ContractFactory.merge([
    {
      countryId: countryId,
      status: 3,
      createdBy: userId,
      ispId: isp.id,
    },
  ])
    .with('currency')
    .with('frequency')
    .with('attachments')
    .with('schools', 2, (school) => {
      school.merge({
        countryId: countryId,
      })
    })
    .with('expectedMetrics', 4, (em) => {
      em.merge([
        {
          metricId: metrics[0].id,
          value: 100,
        },
        {
          metricId: metrics[1].id,
          value: 10,
        },
        {
          metricId: metrics[2].id,
          value: 3,
        },
        {
          metricId: metrics[3].id,
          value: 5,
        },
      ])
    })
    .create()
  await MeasureFactory.merge([
    {
      metricId: metrics[0].id,
      value: 100,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now(),
    },
    {
      metricId: metrics[1].id,
      value: 10,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now(),
    },
    {
      metricId: metrics[2].id,
      value: 3,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now(),
    },
    {
      metricId: metrics[3].id,
      value: 5,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now(),
    },
    // week
    {
      metricId: metrics[0].id,
      value: 100,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().minus({ days: 7 }),
    },
    {
      metricId: metrics[1].id,
      value: 10,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().minus({ days: 7 }),
    },
    {
      metricId: metrics[2].id,
      value: 3,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().minus({ days: 7 }),
    },
    {
      metricId: metrics[3].id,
      value: 5,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().minus({ days: 7 }),
    },
    // month
    {
      metricId: metrics[0].id,
      value: 90,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().minus({ month: 1 }),
    },
    {
      metricId: metrics[1].id,
      value: 8,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().minus({ month: 1 }),
    },
    {
      metricId: metrics[2].id,
      value: 3,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().minus({ month: 1 }),
    },
    {
      metricId: metrics[3].id,
      value: 5,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().minus({ month: 1 }),
    },
  ]).createMany(12)
  return contract
}
