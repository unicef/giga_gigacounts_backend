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
  test('Successfully get payment', async ({ client, expect, assert }) => {
    const user = await setupUser()
    const contract = await setupModels(user.countryId, user.id)
    const paymentRes = await createPayment(client, user, 8, contract.id, contract.currencyId)
    const response = await client.get(`/payment/${paymentRes.id}`).loginAs(user)
    const payment = response.body() as GetPayment

    expect(payment.dateFrom).toBe('2022-08-01')
    expect(payment.dateTo).toBe('2022-08-13')
    expect(payment.paidDate.month).toBe(8)
    expect(payment.paidDate.year).toBe(2022)
    expect(payment.description).toBe('payment description')
    expect(payment.currency.name).toBe('US Dollar')
    expect(payment.amount).toBe(100000)
    expect(payment.status).toBe('Verified')
    expect(payment.metrics?.connectionsMedian[0].median_value).toBe(100)
    expect(payment.metrics?.connectionsMedian[1].median_value).toBe(10)
    expect(payment.metrics?.connectionsMedian[2].median_value).toBe(10)
    expect(payment.metrics?.connectionsMedian[3].median_value).toBe(10)
    expect(payment.metrics?.allEqualOrAboveAvg).toBe(33.33)
    expect(payment.metrics?.withoutConnection).toBe(33.33)
    expect(payment.metrics?.atLeastOneBellowAvg).toBe(33.33)
    assert.isNotEmpty(payment.invoice)
    expect(payment.createdBy?.name).toBe(user.name)
    expect(payment.createdBy?.role).toBe(user.roles[0].name)
  })
  test('Successfully get payment with receipt', async ({ client, expect, assert }) => {
    const user = await setupUser()
    const contract = await setupModels(user.countryId, user.id)
    const paymentRes = await createPayment(client, user, 8, contract.id, contract.currencyId, true)
    const response = await client.get(`/payment/${paymentRes.id}`).loginAs(user)
    const payment = response.body() as GetPayment
    expect(payment.paidDate.month).toBe(8)
    expect(payment.paidDate.year).toBe(2022)
    expect(payment.dateFrom).toBe('2022-08-01')
    expect(payment.dateTo).toBe('2022-08-13')
    expect(payment.description).toBe('payment description')
    expect(payment.currency.name).toBe('US Dollar')
    expect(payment.amount).toBe(100000)
    expect(payment.status).toBe('Verified')
    expect(payment.metrics?.connectionsMedian[0].median_value).toBe(100)
    expect(payment.metrics?.connectionsMedian[1].median_value).toBe(10)
    expect(payment.metrics?.connectionsMedian[2].median_value).toBe(10)
    expect(payment.metrics?.connectionsMedian[3].median_value).toBe(10)
    expect(payment.metrics?.allEqualOrAboveAvg).toBe(33.33)
    expect(payment.metrics?.withoutConnection).toBe(33.33)
    expect(payment.metrics?.atLeastOneBellowAvg).toBe(33.33)
    assert.isNotEmpty(payment.invoice)
    assert.isNotEmpty(payment.receipt)
    expect(payment.createdBy?.name).toBe(user.name)
    expect(payment.createdBy?.role).toBe(user.roles[0].name)
  })
  test('Throw an error when payment is not found', async ({ client, expect }) => {
    const user = await setupUser()
    await setupModels(user.countryId, user.id)
    const response = await client.get('/payment/3333').loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(404)
    expect(error.text).toBe('NOT_FOUND: Payment not found')
  })
})

const createPayment = async (
  client: ApiClient,
  user: User,
  month: number,
  contractId: number,
  currencyId: number,
  hasReceipt: boolean = false
) => {
  const body = await testUtils.buildCreatePaymentBody(
    month,
    2022,
    contractId.toString(),
    currencyId.toString(),
    hasReceipt
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
