import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import UserFactory from 'Database/factories/UserFactory'
import ContractFactory from 'Database/factories/ContractFactory'
import MeasureFactory from 'Database/factories/MeasureFactory'
import MetricFactory from 'Database/factories/MetricFactory'

import testUtils from '../../utils'
import Payment from 'App/Models/Payment'
import Attachment from 'App/Models/Attachment'
import { GetPayment } from 'App/DTOs/Payment'
import { PaymentStatus } from '../../../app/Helpers/constants'

const requiredFields = ['month', 'year', 'contractId', 'currencyId', 'amount']

test.group('Create Payment', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully create a payment in August 2022', async ({ client, expect }) => {
    const user = await setupUser('ISP')
    const contract = await setupModels(user.countryId, user.id)
    const body = await testUtils.buildCreatePaymentBody(
      8,
      2022,
      contract.id.toString(),
      contract.currencyId.toString()
    )
    const response = await client.post('/payment').loginAs(user).json(body)
    const payment = response.body() as GetPayment
    expect(payment.metrics?.connectionsMedian[0].median_value).toBe(100)
    expect(payment.metrics?.connectionsMedian[1].median_value).toBe(10)
    expect(payment.metrics?.connectionsMedian[2].median_value).toBe(10)
    expect(payment.metrics?.connectionsMedian[3].median_value).toBe(10)
    expect(payment.metrics?.allEqualOrAboveAvg).toBe(33.33)
    expect(payment.metrics?.atLeastOneBellowAvg).toBe(33.33)
    expect(payment.metrics?.withoutConnection).toBe(33.33)
    expect(payment.dateFrom).toContain('2022-08-01')
    expect(payment.dateTo).toContain('2022-08-13')
    expect(payment.paidDate.month).toBe(8)
    expect(payment.paidDate.year).toBe(2022)
    expect(payment.amount).toBe(100000)
    expect(payment.currency.id).toBe(contract.currencyId)
    expect(payment.createdBy?.id).toBe(user.id)
    expect(payment.createdBy?.name).toBe(user.name)
    expect(payment.createdBy?.role).toBe(user.roles[0]?.name)
    expect(payment.description).toBe('payment description')
    expect(payment.status).toBe(PaymentStatus[0])
    const invoice = await Attachment.find(payment.invoice?.id)
    expect(invoice?.url).not.toBeNull()
    expect(invoice?.name).toBe('File')
  })
  test('Successfully create a payment in July 2022', async ({ client, expect }) => {
    const user = await setupUser('Government')
    const contract = await setupModels(user.countryId, user.id)
    const body = await testUtils.buildCreatePaymentBody(
      7,
      2022,
      contract.id.toString(),
      contract.currencyId.toString()
    )
    const response = await client.post('/payment').loginAs(user).json(body)
    const payment = response.body() as GetPayment
    expect(payment.metrics?.connectionsMedian[0].median_value).toBe(100)
    expect(payment.metrics?.connectionsMedian[1].median_value).toBe(20)
    expect(payment.metrics?.connectionsMedian[2].median_value).toBe(10)
    expect(payment.metrics?.connectionsMedian[3].median_value).toBe(15)
    expect(payment.metrics?.allEqualOrAboveAvg).toBe(66.67)
    expect(payment.metrics?.atLeastOneBellowAvg).toBe(0)
    expect(payment.metrics?.withoutConnection).toBe(33.33)
    expect(payment.dateFrom).toContain('2022-07-01')
    expect(payment.dateTo).toContain('2022-07-31')
    expect(payment.paidDate.month).toBe(7)
    expect(payment.paidDate.year).toBe(2022)
    expect(payment.amount).toBe(100000)
    expect(payment.currency.id).toBe(contract.currencyId)
    expect(payment.createdBy?.id).toBe(user.id)
    expect(payment.createdBy?.name).toBe(user.name)
    expect(payment.createdBy?.role).toBe(user.roles[0]?.name)
    expect(payment.description).toBe('payment description')
    expect(payment.status).toBe(PaymentStatus[2])
    const invoice = await Attachment.find(payment.invoice?.id)
    expect(invoice?.url).not.toBeNull()
    expect(invoice?.name).toBe('File')
  })
  test('Throw an error when trying to create a payment in the same period', async ({
    client,
    expect,
  }) => {
    const user = await setupUser('ISP')
    const contract = await setupModels(user.countryId, user.id)
    const body = await testUtils.buildCreatePaymentBody(
      7,
      2022,
      contract.id.toString(),
      contract.currencyId.toString()
    )
    let response = await client.post('/payment').loginAs(user).json(body)
    const payment = response.body() as GetPayment
    expect(payment.metrics?.connectionsMedian[0].median_value).toBe(100)
    expect(payment.metrics?.connectionsMedian[1].median_value).toBe(20)
    expect(payment.metrics?.connectionsMedian[2].median_value).toBe(10)
    expect(payment.metrics?.connectionsMedian[3].median_value).toBe(15)
    expect(payment.metrics?.allEqualOrAboveAvg).toBe(66.67)
    expect(payment.metrics?.atLeastOneBellowAvg).toBe(0)
    expect(payment.metrics?.withoutConnection).toBe(33.33)
    expect(payment.dateFrom).toContain('2022-07-01')
    expect(payment.dateTo).toContain('2022-07-31')
    expect(payment.paidDate.month).toBe(7)
    expect(payment.paidDate.year).toBe(2022)
    expect(payment.amount).toBe(100000)
    expect(payment.currency.id).toBe(contract.currencyId)
    expect(payment.createdBy?.id).toBe(user.id)
    expect(payment.createdBy?.name).toBe(user.name)
    expect(payment.createdBy?.role).toBe(user.roles[0]?.name)
    expect(payment.description).toBe('payment description')
    expect(payment.status).toBe(PaymentStatus[0])
    const invoice = await Attachment.find(payment.invoice?.id)
    expect(invoice?.url).not.toBeNull()
    expect(invoice?.name).toBe('File')
    response = await client.post('/payment').loginAs(user).json(body)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(error.text).toBe('ALREADY_HAS_PAYMENT: Contract already has payment on that month-year')
    const payments = await Payment.all()
    expect(payments.length).toBe(1)
  })
  test('Throw an error if validation fails', async ({ client, expect }) => {
    const user = await setupUser('Government')
    const response = await client.post('/payment').loginAs(user).json({})
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(5)
    JSON.parse(error.text).errors.map((e) => {
      expect(e.message).toBe('required validation failed')
      expect(e.rule).toBe('required')
      expect(requiredFields.some((v) => v === e.field)).toBeTruthy()
    })
  })
  test('Successfully create a payment as a Country office and status is verified', async ({
    client,
    expect,
  }) => {
    const user = await setupUser('Country Office')
    const contract = await setupModels(user.countryId, user.id)
    const body = await testUtils.buildCreatePaymentBody(
      7,
      2022,
      contract.id.toString(),
      contract.currencyId.toString()
    )
    const response = await client.post('/payment').loginAs(user).json(body)
    const payment = response.body() as GetPayment
    expect(payment.metrics?.connectionsMedian[0].median_value).toBe(100)
    expect(payment.metrics?.connectionsMedian[1].median_value).toBe(20)
    expect(payment.metrics?.connectionsMedian[2].median_value).toBe(10)
    expect(payment.metrics?.connectionsMedian[3].median_value).toBe(15)
    expect(payment.metrics?.allEqualOrAboveAvg).toBe(66.67)
    expect(payment.metrics?.atLeastOneBellowAvg).toBe(0)
    expect(payment.metrics?.withoutConnection).toBe(33.33)
    expect(payment.dateFrom).toContain('2022-07-01')
    expect(payment.dateTo).toContain('2022-07-31')
    expect(payment.paidDate.month).toBe(7)
    expect(payment.paidDate.year).toBe(2022)
    expect(payment.amount).toBe(100000)
    expect(payment.currency.id).toBe(contract.currencyId)
    expect(payment.createdBy?.id).toBe(user.id)
    expect(payment.createdBy?.name).toBe(user.name)
    expect(payment.createdBy?.role).toBe(user.roles[0]?.name)
    expect(payment.description).toBe('payment description')
    expect(payment.status).toBe(PaymentStatus[2])
    const invoice = await Attachment.find(payment.invoice?.id)
    expect(invoice?.url).not.toBeNull()
    expect(invoice?.name).toBe('File')
  })
  test('Successfully create a payment as a Giga Admin and status is verified', async ({
    client,
    expect,
  }) => {
    const user = await setupUser('Giga Admin')
    const contract = await setupModels(user.countryId, user.id)
    const body = await testUtils.buildCreatePaymentBody(
      7,
      2022,
      contract.id.toString(),
      contract.currencyId.toString()
    )
    const response = await client.post('/payment').loginAs(user).json(body)
    const payment = response.body() as GetPayment
    expect(payment.metrics?.connectionsMedian[0].median_value).toBe(100)
    expect(payment.metrics?.connectionsMedian[1].median_value).toBe(20)
    expect(payment.metrics?.connectionsMedian[2].median_value).toBe(10)
    expect(payment.metrics?.connectionsMedian[3].median_value).toBe(15)
    expect(payment.metrics?.allEqualOrAboveAvg).toBe(66.67)
    expect(payment.metrics?.atLeastOneBellowAvg).toBe(0)
    expect(payment.metrics?.withoutConnection).toBe(33.33)
    expect(payment.dateFrom).toContain('2022-07-01')
    expect(payment.dateTo).toContain('2022-07-31')
    expect(payment.paidDate.month).toBe(7)
    expect(payment.paidDate.year).toBe(2022)
    expect(payment.amount).toBe(100000)
    expect(payment.currency.id).toBe(contract.currencyId)
    expect(payment.createdBy?.id).toBe(user.id)
    expect(payment.createdBy?.name).toBe(user.name)
    expect(payment.createdBy?.role).toBe(user.roles[0]?.name)
    expect(payment.description).toBe('payment description')
    expect(payment.status).toBe(PaymentStatus[2])
    const invoice = await Attachment.find(payment.invoice?.id)
    expect(invoice?.url).not.toBeNull()
    expect(invoice?.name).toBe('File')
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
      endDate: DateTime.now().set({
        year: 2022,
        month: 8,
        day: 13,
        hour: 0,
        millisecond: 0,
        minute: 0,
        second: 0,
      }),
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
