import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import { ApiClient } from '@japa/api-client'

import UserFactory from 'Database/factories/UserFactory'
import ContractFactory from 'Database/factories/ContractFactory'
import MeasureFactory from 'Database/factories/MeasureFactory'
import MetricFactory from 'Database/factories/MetricFactory'

import testUtils from '../../utils'
import Payment from 'App/Models/Payment'
import Contract from 'App/Models/Contract'
import User from 'App/Models/User'

interface CheckPaymentData {
  dateFrom: string
  dateTo: string
  invoiceId: number | null
  receiptId: number | null
  amount: number
  description: string
  withoutConnection: number
  atLeastOneBellowAvg: number
  allEqualOrAboveAvg: number
  payment: Payment
}

test.group('Update Payment', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully update a payment with all editable fields', async ({ client, expect }) => {
    const user = await setupUser('Giga Admin')
    const contract = await setupModels(user.countryId, user.id)
    const createdPayment = await createPayment(8, 2022, contract, user, client)
    validatePayment(
      {
        payment: createdPayment,
        dateFrom: '2022-08-01',
        dateTo: '2022-08-13',
        description: 'payment description',
        amount: 100000,
        allEqualOrAboveAvg: 33.33,
        withoutConnection: 33.33,
        atLeastOneBellowAvg: 33.33,
        invoiceId: null,
        receiptId: null,
      },
      expect
    )
    const body = await testUtils.buildUpdatePaymentBody(
      createdPayment.id.toString(),
      7,
      2022,
      100,
      true,
      true
    )
    const response = await client.put('/payment').json(body).loginAs(user)
    const payment = response.body() as Payment
    validatePayment(
      {
        payment,
        dateFrom: '2022-07-01',
        dateTo: '2022-07-31',
        description: 'payment description updated',
        amount: 100,
        allEqualOrAboveAvg: 66.67,
        withoutConnection: 33.33,
        atLeastOneBellowAvg: 0,
        invoiceId: createdPayment.invoiceId,
        receiptId: createdPayment.receiptId,
      },
      expect
    )
  })
  test('Successfully update a payment month-year', async ({ client, expect }) => {
    const user = await setupUser('Giga Admin')
    const contract = await setupModels(user.countryId, user.id)
    const createdPayment = await createPayment(8, 2022, contract, user, client)
    validatePayment(
      {
        payment: createdPayment,
        dateFrom: '2022-08-01',
        dateTo: '2022-08-13',
        description: 'payment description',
        amount: 100000,
        allEqualOrAboveAvg: 33.33,
        withoutConnection: 33.33,
        atLeastOneBellowAvg: 33.33,
        invoiceId: null,
        receiptId: null,
      },
      expect
    )
    const body = await testUtils.buildUpdatePaymentBody(createdPayment.id.toString(), 7, 2022)
    const response = await client.put('/payment').json(body).loginAs(user)
    const payment = response.body() as Payment
    validatePayment(
      {
        payment,
        dateFrom: '2022-07-01',
        dateTo: '2022-07-31',
        description: 'payment description',
        amount: 100000,
        allEqualOrAboveAvg: 66.67,
        withoutConnection: 33.33,
        atLeastOneBellowAvg: 0,
        invoiceId: null,
        receiptId: null,
      },
      expect
    )
  })
  test('Throw an error when trying to update month-year without passing year', async ({
    client,
    expect,
  }) => {
    const user = await setupUser('Giga Admin')
    const response = await client.put('/payment').json({ paymentId: '333', month: 7 }).loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe('month and year are required if together')
  })
  test('Throw an error when trying to update month-year without passing month', async ({
    client,
    expect,
  }) => {
    const user = await setupUser('Giga Admin')
    const response = await client
      .put('/payment')
      .json({ paymentId: '333', year: 2022 })
      .loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe('month and year are required if together')
  })
  test('Dont update receipt without having authorization', async ({ client, expect }) => {
    const user = await setupUser('ISP')
    const contract = await setupModels(user.countryId, user.id)
    const createdPayment = await createPayment(8, 2022, contract, user, client)
    validatePayment(
      {
        payment: createdPayment,
        dateFrom: '2022-08-01',
        dateTo: '2022-08-13',
        description: 'payment description',
        amount: 100000,
        allEqualOrAboveAvg: 33.33,
        withoutConnection: 33.33,
        atLeastOneBellowAvg: 33.33,
        invoiceId: null,
        receiptId: null,
      },
      expect
    )
    const body = await testUtils.buildUpdatePaymentBody(
      createdPayment.id.toString(),
      undefined,
      undefined,
      undefined,
      false,
      true
    )
    const response = await client.put('/payment').json(body).loginAs(user)
    const payment = response.body() as Payment
    validatePayment(
      {
        payment,
        dateFrom: '2022-08-01',
        dateTo: '2022-08-13',
        description: 'payment description',
        amount: 100000,
        allEqualOrAboveAvg: 33.33,
        withoutConnection: 33.33,
        atLeastOneBellowAvg: 33.33,
        invoiceId: null,
        receiptId: null,
      },
      expect
    )
    expect(payment.receiptId).toBe(createdPayment.receiptId)
  })
  test('Throw an error when trying to update month-year to a already taken month-year', async ({
    client,
    expect,
  }) => {
    const user = await setupUser('ISP')
    const contract = await setupModels(user.countryId, user.id)
    const createdPayment = await createPayment(8, 2022, contract, user, client)
    await createPayment(7, 2022, contract, user, client)
    validatePayment(
      {
        payment: createdPayment,
        dateFrom: '2022-08-01',
        dateTo: '2022-08-13',
        description: 'payment description',
        amount: 100000,
        allEqualOrAboveAvg: 33.33,
        withoutConnection: 33.33,
        atLeastOneBellowAvg: 33.33,
        invoiceId: null,
        receiptId: null,
      },
      expect
    )
    const body = await testUtils.buildUpdatePaymentBody(
      createdPayment.id.toString(),
      7,
      2022,
      undefined
    )
    const response = await client.put('/payment').json(body).loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(error.text).toBe('ALREADY_HAS_PAYMENT: Contract already has payment on that month-year')
  })
  test('Throw an error when not passing paymentId', async ({ client, expect }) => {
    const user = await setupUser('Giga Admin')
    const response = await client.put('/payment').json({ year: 2022, month: 7 }).loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe('required validation failed')
    expect(JSON.parse(error.text).errors[0].field).toBe('paymentId')
  })
  test('Throw an error when Payment not found', async ({ client, expect }) => {
    const user = await setupUser('Giga Admin')
    const response = await client.put('/payment').json({ paymentId: '0202020' }).loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(404)
    expect(error.text).toBe('NOT_FOUND: Payment not found')
  })
  test('Throw an error when the file passed exceeds 20mb limit', async ({ client, expect }) => {
    const user = await setupUser('Government')
    const contract = await setupModels(user.countryId, user.id)
    const body = await testUtils.buildCreatePaymentBody(
      7,
      2022,
      contract.id.toString(),
      contract.currencyId.toString()
    )
    body.invoice = {
      file: 'data:application/pdf;base64,' + Buffer.allocUnsafe(20 * 1024 * 1025),
      name: 'Large_file.pdf',
    }
    const response = await client.post('/payment').loginAs(user).json(body)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(413)
    expect(JSON.parse(error.text).message).toBe(
      'E_REQUEST_ENTITY_TOO_LARGE: request entity too large'
    )
  })
})

const validatePayment = async (data: CheckPaymentData, expect: any) => {
  const { payment } = data
  expect(payment.dateFrom).toContain(data.dateFrom)
  expect(payment.dateTo).toContain(data.dateTo)
  expect(payment.amount).toBe(data.amount)
  expect(payment.description).toBe(data.description)
  expect(payment.metrics?.withoutConnection).toBe(data.withoutConnection)
  expect(payment.metrics?.atLeastOneBellowAvg).toBe(data.atLeastOneBellowAvg)
  expect(payment.metrics?.allEqualOrAboveAvg).toBe(data.allEqualOrAboveAvg)
  expect(payment.invoiceId).not.toBeNull()
  expect(payment.receiptId).not.toBeNull()
  if (data.invoiceId) expect(payment.invoiceId).not.toBe(data.invoiceId)
  if (data.receiptId) expect(payment.receiptId).not.toBe(data.receiptId)
}

const createPayment = async (
  month: number,
  year: number,
  contract: Contract,
  user: User,
  client: ApiClient
): Promise<Payment> => {
  const body = await testUtils.buildCreatePaymentBody(
    month,
    year,
    contract.id.toString(),
    contract.currencyId.toString(),
    true
  )
  const response = await client.post('/payment').loginAs(user).json(body)
  return response.body()
}

const setupUser = async (name: string, hasPermission = true) => {
  return UserFactory.with('roles', 1, (role) =>
    role
      .merge({ name })
      .with('permissions', 1, (permission) =>
        permission.merge({ name: hasPermission ? 'payment.write' : 'contract.write' })
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
