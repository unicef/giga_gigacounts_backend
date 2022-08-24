import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import UserFactory from 'Database/factories/UserFactory'
import CountryFactory from 'Database/factories/CountryFactory'
import MetricFactory from 'Database/factories/MetricFactory'
import ContractFactory from 'Database/factories/ContractFactory'
import MeasureFactory from 'Database/factories/MeasureFactory'

import { CalculateMeasuresDTO } from 'App/DTOs/Measure'

test.group('Calculate Measures by Month and Year', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully calculate measures in August 2022', async ({ expect, client }) => {
    const user = await setupUser()
    const contract = await setupModels(user.countryId, user.id)
    const response = await client
      .post('/measure/calculate')
      .json({
        contractId: contract.id,
        month: 8,
        year: 2022,
      })
      .loginAs(user)
    const connections = response.body() as CalculateMeasuresDTO
    expect(connections.connectionsMedian[0].median_value).toBe(100)
    expect(connections.connectionsMedian[1].median_value).toBe(10)
    expect(connections.connectionsMedian[2].median_value).toBe(10)
    expect(connections.connectionsMedian[3].median_value).toBe(10)
    expect(connections.allEqualOrAboveAvg).toBe(33.33)
    expect(connections.atLeastOneBellowAvg).toBe(33.33)
    expect(connections.withoutConnection).toBe(33.33)
  })
  test('Successfully calculate measures in July 2022', async ({ expect, client }) => {
    const user = await setupUser()
    const contract = await setupModels(user.countryId, user.id)
    const response = await client
      .post('/measure/calculate')
      .json({
        contractId: contract.id,
        month: 7,
        year: 2022,
      })
      .loginAs(user)
    const connections = response.body() as CalculateMeasuresDTO
    expect(connections.connectionsMedian[0].median_value).toBe(100)
    expect(connections.connectionsMedian[1].median_value).toBe(20)
    expect(connections.connectionsMedian[2].median_value).toBe(10)
    expect(connections.connectionsMedian[3].median_value).toBe(15)
    expect(connections.allEqualOrAboveAvg).toBe(66.67)
    expect(connections.atLeastOneBellowAvg).toBe(0)
    expect(connections.withoutConnection).toBe(33.33)
  })
  test('Throw an error when validation fails', async ({ expect, client }) => {
    const user = await setupUser()
    const response = await client
      .post('/measure/calculate')
      .json({
        contractId: 1,
        month: 7,
        year: 2022,
      })
      .loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe('string validation failed')
    expect(JSON.parse(error.text).errors[0].field).toBe('contractId')
    expect(JSON.parse(error.text).errors[0].rule).toBe('string')
  })
  test('Successfully calculate measures in September 2022', async ({ expect, client }) => {
    const user = await setupUser()
    const contract = await setupModels(user.countryId, user.id)
    const response = await client
      .post('/measure/calculate')
      .json({
        contractId: contract.id,
        month: 9,
        year: 2022,
      })
      .loginAs(user)
    const connections = response.body() as CalculateMeasuresDTO
    expect(connections.connectionsMedian.length).toBe(0)
    expect(connections.allEqualOrAboveAvg).toBe(0)
    expect(connections.atLeastOneBellowAvg).toBe(0)
    expect(connections.withoutConnection).toBe(100)
  })
})

const setupUser = async () => {
  const country = await CountryFactory.create()
  return UserFactory.merge({ countryId: country.id })
    .with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'measure.read' }))
    )
    .create()
}

const setupModels = async (countryId: number, userId: number) => {
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
    },
  ])
    .with('isp')
    .with('currency')
    .with('frequency')
    .with('attachments')
    .with('schools', 3, (school) => {
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
          value: 20,
        },
        {
          metricId: metrics[2].id,
          value: 10,
        },
        {
          metricId: metrics[3].id,
          value: 10,
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
      createdAt: DateTime.now().set({ day: 1, month: 8, year: 2022 }),
    },
    {
      metricId: metrics[1].id,
      value: 30,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 2, month: 8, year: 2022 }),
    },
    {
      metricId: metrics[2].id,
      value: 15,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 3, month: 8, year: 2022 }),
    },
    {
      metricId: metrics[3].id,
      value: 17,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 4, month: 8, year: 2022 }),
    },
    {
      metricId: metrics[0].id,
      value: 100,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 5, month: 8, year: 2022 }),
    },
    {
      metricId: metrics[1].id,
      value: 10,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 6, month: 8, year: 2022 }),
    },
    {
      metricId: metrics[2].id,
      value: 8,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 7, month: 8, year: 2022 }),
    },
    {
      metricId: metrics[3].id,
      value: 9,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 8, month: 8, year: 2022 }),
    },
    // --
    {
      metricId: metrics[0].id,
      value: 100,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 8, month: 7, year: 2022 }),
    },
    {
      metricId: metrics[1].id,
      value: 20,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 9, month: 7, year: 2022 }),
    },
    {
      metricId: metrics[2].id,
      value: 10,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 10, month: 7, year: 2022 }),
    },
    {
      metricId: metrics[3].id,
      value: 10,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 11, month: 7, year: 2022 }),
    },
    // --
    {
      metricId: metrics[0].id,
      value: 100,
      schoolId: contract.schools[1].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 1, month: 8, year: 2022 }),
    },
    {
      metricId: metrics[1].id,
      value: 8,
      schoolId: contract.schools[1].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 2, month: 8, year: 2022 }),
    },
    {
      metricId: metrics[2].id,
      value: 10,
      schoolId: contract.schools[1].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 3, month: 8, year: 2022 }),
    },
    {
      metricId: metrics[3].id,
      value: 10,
      schoolId: contract.schools[1].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 4, month: 8, year: 2022 }),
    },
    //
    {
      metricId: metrics[0].id,
      value: 100,
      schoolId: contract.schools[1].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 1, month: 7, year: 2022 }),
    },
    {
      metricId: metrics[1].id,
      value: 20,
      schoolId: contract.schools[1].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 2, month: 7, year: 2022 }),
    },
    {
      metricId: metrics[2].id,
      value: 10,
      schoolId: contract.schools[1].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 3, month: 7, year: 2022 }),
    },
    {
      metricId: metrics[3].id,
      value: 20,
      schoolId: contract.schools[1].id,
      contractId: contract.id,
      createdAt: DateTime.now().set({ day: 4, month: 7, year: 2022 }),
    },
  ]).createMany(20)
  return contract
}
