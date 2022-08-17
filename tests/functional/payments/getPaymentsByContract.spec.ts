import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import UserFactory from 'Database/factories/UserFactory'
import ContractFactory from 'Database/factories/ContractFactory'
import MeasureFactory from 'Database/factories/MeasureFactory'
import MetricFactory from 'Database/factories/MetricFactory'

import Payment from 'App/Models/Payment'
import Attachment from 'App/Models/Attachment'
import PaymentFactory from 'Database/factories/PaymentFactory'

test.group('Get Payments by Contract', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully get payment list of a contract', async ({ client, expect }) => {
    const user = await setupUser()
    const contract = await setupModels(user.countryId, user.id)
  })
})

const createPayments = () => {
  return PaymentFactory.merge([{}]).createMany(2)
}

const setupUser = async () => {
  return UserFactory.with('roles', 1, (role) =>
    role
      .merge({ name: 'Giga Admin' })
      .with('permissions', 2, (permission) =>
        permission.merge([{ name: 'payment.write' }, { name: 'contract.read' }])
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
