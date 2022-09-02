import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import { ApiClient } from '@japa/api-client'

import UserFactory from 'Database/factories/UserFactory'
import ContractFactory from 'Database/factories/ContractFactory'
import MeasureFactory from 'Database/factories/MeasureFactory'
import MetricFactory from 'Database/factories/MetricFactory'

import testUtils from '../../utils'
import User from 'App/Models/User'
import { GetPayment } from 'App/DTOs/Payment'

test.group('Get Payments by Contract', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully get payment list of a contract Aug 2022', async ({
    client,
    expect,
    assert,
  }) => {
    const user = await setupUser()
    const contract = await setupModels(user.countryId, user.id)
    await createPayment(client, user, 8, contract.id, contract.currencyId)
    const response = await client.get(`/payment/contract/${contract.id}`).loginAs(user)
    const payments = response.body() as GetPayment[]
    expect(payments[0].paidDate.month).toBe(8)
    expect(payments[0].paidDate.year).toBe(2022)
    expect(payments[0].description).toBe('payment description')
    expect(payments[0].currency.name).toBe('US Dollar')
    expect(payments[0].amount).toBe(100000)
    expect(payments[0].status).toBe('Verified')
    expect(payments[0].metrics?.connectionsMedian[0].median_value).toBe(100)
    expect(payments[0].metrics?.connectionsMedian[1].median_value).toBe(10)
    expect(payments[0].metrics?.connectionsMedian[2].median_value).toBe(10)
    expect(payments[0].metrics?.connectionsMedian[3].median_value).toBe(10)
    expect(payments[0].metrics?.allEqualOrAboveAvg).toBe(33.33)
    expect(payments[0].metrics?.withoutConnection).toBe(33.33)
    expect(payments[0].metrics?.atLeastOneBellowAvg).toBe(33.33)
    expect(payments[0].createdBy?.name).toBe(user.name)
    expect(payments[0].createdBy?.role).toBe(user.roles[0].name)
    expect(payments[0].dateFrom).toBe('2022-08-01')
    expect(payments[0].dateTo).toBe('2022-08-13')
    assert.isNotEmpty(payments[0].invoice)
  })
  test('Successfully get payment list of a contract July 2022', async ({
    client,
    expect,
    assert,
  }) => {
    const user = await setupUser()
    const contract = await setupModels(user.countryId, user.id)
    await createPayment(client, user, 7, contract.id, contract.currencyId)
    const response = await client.get(`/payment/contract/${contract.id}`).loginAs(user)
    const payments = response.body() as GetPayment[]
    expect(payments[0].paidDate.month).toBe(7)
    expect(payments[0].paidDate.year).toBe(2022)
    expect(payments[0].description).toBe('payment description')
    expect(payments[0].currency.name).toBe('US Dollar')
    expect(payments[0].amount).toBe(100000)
    expect(payments[0].status).toBe('Verified')
    expect(payments[0].metrics?.connectionsMedian[0].median_value).toBe(100)
    expect(payments[0].metrics?.connectionsMedian[1].median_value).toBe(20)
    expect(payments[0].metrics?.connectionsMedian[2].median_value).toBe(10)
    expect(payments[0].metrics?.connectionsMedian[3].median_value).toBe(15)
    expect(payments[0].metrics?.allEqualOrAboveAvg).toBe(66.67)
    expect(payments[0].metrics?.withoutConnection).toBe(33.33)
    expect(payments[0].metrics?.atLeastOneBellowAvg).toBe(0)
    expect(payments[0].createdBy?.name).toBe(user.name)
    expect(payments[0].createdBy?.role).toBe(user.roles[0].name)
    expect(payments[0].dateFrom).toBe('2022-07-01')
    expect(payments[0].dateTo).toBe('2022-07-31')
    assert.isNotEmpty(payments[0].invoice)
  })
  test('Successfully get payment list of a contract Aug/July 2022', async ({
    client,
    expect,
    assert,
  }) => {
    const user = await setupUser()
    const contract = await setupModels(user.countryId, user.id)
    await createPayment(client, user, 8, contract.id, contract.currencyId)
    await createPayment(client, user, 7, contract.id, contract.currencyId)
    const response = await client.get(`/payment/contract/${contract.id}`).loginAs(user)
    const payments = response.body() as GetPayment[]
    expect(payments[0].paidDate.month).toBe(8)
    expect(payments[0].paidDate.year).toBe(2022)
    expect(payments[0].description).toBe('payment description')
    expect(payments[0].currency.name).toBe('US Dollar')
    expect(payments[0].amount).toBe(100000)
    expect(payments[0].status).toBe('Verified')
    expect(payments[0].metrics?.connectionsMedian[0].median_value).toBe(100)
    expect(payments[0].metrics?.connectionsMedian[1].median_value).toBe(10)
    expect(payments[0].metrics?.connectionsMedian[2].median_value).toBe(10)
    expect(payments[0].metrics?.connectionsMedian[3].median_value).toBe(10)
    expect(payments[0].metrics?.allEqualOrAboveAvg).toBe(33.33)
    expect(payments[0].metrics?.withoutConnection).toBe(33.33)
    expect(payments[0].metrics?.atLeastOneBellowAvg).toBe(33.33)
    expect(payments[0].createdBy?.name).toBe(user.name)
    expect(payments[0].createdBy?.role).toBe(user.roles[0].name)
    expect(payments[0].dateFrom).toBe('2022-08-01')
    expect(payments[0].dateTo).toBe('2022-08-13')
    assert.isNotEmpty(payments[0].invoice)
    expect(payments[0].paidDate.month).toBe(8)
    expect(payments[0].paidDate.year).toBe(2022)
    expect(payments[1].description).toBe('payment description')
    expect(payments[1].currency.name).toBe('US Dollar')
    expect(payments[1].amount).toBe(100000)
    expect(payments[1].status).toBe('Verified')
    expect(payments[1].metrics?.connectionsMedian[0].median_value).toBe(100)
    expect(payments[1].metrics?.connectionsMedian[1].median_value).toBe(20)
    expect(payments[1].metrics?.connectionsMedian[2].median_value).toBe(10)
    expect(payments[1].metrics?.connectionsMedian[3].median_value).toBe(15)
    expect(payments[1].metrics?.allEqualOrAboveAvg).toBe(66.67)
    expect(payments[1].metrics?.withoutConnection).toBe(33.33)
    expect(payments[1].metrics?.atLeastOneBellowAvg).toBe(0)
    expect(payments[1].createdBy?.name).toBe(user.name)
    expect(payments[1].createdBy?.role).toBe(user.roles[0].name)
    expect(payments[1].dateFrom).toBe('2022-07-01')
    expect(payments[1].dateTo).toBe('2022-07-31')
    assert.isNotEmpty(payments[1].invoice)
  })
})

const createPayment = async (
  client: ApiClient,
  user: User,
  month: number,
  contractId: number,
  currencyId: number
) => {
  const body = await testUtils.buildCreatePaymentBody(
    month,
    2022,
    contractId.toString(),
    currencyId.toString()
  )
  return testUtils.createPayments(client, user, body)
}

const setupUser = async () => {
  return UserFactory.with('roles', 1, (role) =>
    role
      .merge({ name: 'Giga Admin' })
      .with('permissions', 3, (permission) =>
        permission.merge([
          { name: 'payment.write' },
          { name: 'contract.read' },
          { name: 'payment.read' },
        ])
      )
  )
    .with('country')
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
      endDate: DateTime.now().set({ year: 2022, month: 8, day: 13 }),
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
