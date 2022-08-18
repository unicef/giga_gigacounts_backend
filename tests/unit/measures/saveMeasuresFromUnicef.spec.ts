import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import UserFactory from 'Database/factories/UserFactory'
import MetricFactory from 'Database/factories/MetricFactory'
import ContractFactory from 'Database/factories/ContractFactory'

import Measure from 'App/Models/Measure'
import { MeasurementsData } from 'App/Helpers/unicefApi'
import service from 'App/Services/Measure'
import CountryFactory from 'Database/factories/CountryFactory'
import IspFactory from 'Database/factories/IspFactory'

test.group('Save Measures from Unicef', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully save historic measures from unicef api', async ({ expect }) => {
    const { contract, metrics } = await setupModels()
    await service.saveMeasuresFromUnicef(
      generateMeasurementsData(),
      contract.id,
      contract.schools[0].id,
      metrics,
      DateTime.now().set({ year: 2022, month: 7, day: 21, hour: 0, minute: 0, second: 0 }),
      DateTime.now().set({ year: 2022, month: 7, day: 30, hour: 0, minute: 0, second: 0 }),
      'historic'
    )
    const measures = await Measure.query().preload('metric')
    expect(measures.length).toBe(20)
    for (const measure of measures) {
      const json = measure.toJSON()
      if (json.created_at.startsWith('2022-07-21')) {
        if (json.metric.name === 'Latency') expect(json.value).toBe(10)
        if (json.metric.name === 'Download speed') expect(json.value).toBe(28)
        if (json.metric.name === 'Upload speed') expect(json.value).toBe(82)
        if (json.metric.name === 'Uptime') expect(json.value).toBe(71)
      }
      if (json.created_at.startsWith('2022-07-22')) {
        if (json.metric.name === 'Latency') expect(json.value).toBe(5)
        if (json.metric.name === 'Download speed') expect(json.value).toBe(27)
        if (json.metric.name === 'Upload speed') expect(json.value).toBe(59)
        if (json.metric.name === 'Uptime') expect(json.value).toBe(71)
      }
      if (json.created_at.startsWith('2022-07-25')) {
        if (json.metric.name === 'Latency') expect(json.value).toBe(8)
        if (json.metric.name === 'Download speed') expect(json.value).toBe(2)
        if (json.metric.name === 'Upload speed') expect(json.value).toBe(25)
        if (json.metric.name === 'Uptime') expect(json.value).toBe(71)
      }
      if (json.created_at.startsWith('2022-07-26')) {
        if (json.metric.name === 'Latency') expect(json.value).toBe(9)
        if (json.metric.name === 'Download speed') expect(json.value).toBe(29)
        if (json.metric.name === 'Upload speed') expect(json.value).toBe(0)
        if (json.metric.name === 'Uptime') expect(json.value).toBe(71)
      }
    }
  })
  test('Successfully save daily measures from unicef api', async ({ expect }) => {
    const { contract, metrics } = await setupModels()
    await service.saveMeasuresFromUnicef(
      generateMeasurementsData(),
      contract.id,
      contract.schools[0].id,
      metrics,
      DateTime.now().set({ year: 2022, month: 7, day: 21, hour: 0, minute: 0, second: 0 }),
      DateTime.now().set({ year: 2022, month: 7, day: 31, hour: 0, minute: 0, second: 0 }),
      'daily'
    )
    const measures = await Measure.query().preload('metric')
    expect(measures.length).toBe(4)
    for (const measure of measures) {
      const json = measure.toJSON()
      expect(json.created_at).toContain('2022-07-30')
      if (json.metric.name === 'Latency') expect(json.value).toBe(9)
      if (json.metric.name === 'Download speed') expect(json.value).toBe(29)
      if (json.metric.name === 'Upload speed') expect(json.value).toBe(0)
      if (json.metric.name === 'Uptime') expect(json.value).toBe(71)
    }
  })
})

const generateMeasurementsData = (): MeasurementsData[] => [
  {
    download: 27618.635,
    upload: 82181.0,
    latency: '10',
    timestamp: '2022-07-21T10:09:43.267Z',
  },
  {
    download: 27000.635,
    upload: 58603.0,
    latency: '5',
    timestamp: '2022-07-22T10:09:43.267Z',
  },
  {
    download: 2000.635,
    upload: 25188.0,
    latency: '8',
    timestamp: '2022-07-25T10:09:43.267Z',
  },
  {
    download: 28618.635,
    upload: 0,
    latency: '9',
    timestamp: '2022-07-26T10:09:43.267Z',
  },
  {
    download: 28618.635,
    upload: 0,
    latency: '9',
    timestamp: '2022-07-30T10:09:43.267Z',
  },
]

const setupModels = async () => {
  const country = await CountryFactory.create()
  const isp = await IspFactory.merge({ name: 'Verizon' }).create()
  const user = await UserFactory.merge({ countryId: country.id }).with('roles', 1).create()
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
      countryId: country.id,
      status: 3,
      createdBy: user.id,
      ispId: isp.id,
      governmentBehalf: true,
      startDate: DateTime.now().set({
        year: 2022,
        month: 7,
        day: 21,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      }),
      endDate: DateTime.now().set({
        year: 2022,
        month: 7,
        day: 24,
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 59,
      }),
    },
  ])
    .with('currency')
    .with('frequency')
    .with('schools', 1, (school) => {
      school.merge({
        countryId: country.id,
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
  return { contract, metrics }
}
