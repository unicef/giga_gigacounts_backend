import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import ContractFactory from 'Database/factories/ContractFactory'
import PaymentFactory from 'Database/factories/PaymentFactory'
import UserFactory from 'Database/factories/UserFactory'
import { DateTime } from 'luxon'

test.group('Contract Available Payments', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully get available payments for contract from January until end of contract', async ({
    client,
    expect,
  }) => {
    const user = await createUser()
    const contract = await setupModels(user.id)
    await PaymentFactory.merge([
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 1 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 1 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 2 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 2 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 3 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 3 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 4 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 4 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
    ]).createMany(4)
    const response = await client.get(`/contract/available-payments/${contract.id}`).loginAs(user)
    const paymentDates = response.body() as { month: number; year: number }[]
    expect(paymentDates.length).toBe(4)
    expect(paymentDates[0].month).toBe(5)
    expect(paymentDates[0].year).toBe(2022)
    expect(paymentDates[1].month).toBe(6)
    expect(paymentDates[1].year).toBe(2022)
    expect(paymentDates[2].month).toBe(7)
    expect(paymentDates[2].year).toBe(2022)
    expect(paymentDates[3].month).toBe(8)
    expect(paymentDates[3].year).toBe(2022)
  })
  test('Successfully get no available payments for contract when all payments are done', async ({
    client,
    expect,
  }) => {
    const user = await createUser()
    const contract = await setupModels(user.id)
    await PaymentFactory.merge([
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 1 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 1 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 2 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 2 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 3 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 3 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 4 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 4 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 5 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 5 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 6 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 6 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 7 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 7 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 8 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 8 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
    ]).createMany(8)
    const response = await client.get(`/contract/available-payments/${contract.id}`).loginAs(user)
    const paymentDates = response.body() as { month: number; year: number }[]
    expect(paymentDates.length).toBe(0)
  })
  test('Successfully get available payments if contract doesnt start from begin of the month', async ({
    client,
    expect,
  }) => {
    const user = await createUser()
    const contract = await ContractFactory.merge({
      createdBy: user.id,
      startDate: DateTime.now().set({
        year: 2022,
        month: 1,
        day: 23,
        second: 0,
        minute: 0,
        millisecond: 0,
        hour: 0,
      }),
      endDate: DateTime.now().set({ year: 2022, month: 4 }).endOf('month'),
    })
      .with('isp')
      .with('country')
      .with('currency')
      .with('frequency')
      .create()
    await PaymentFactory.merge([
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 1 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 1 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
    ]).createMany(1)
    const response = await client.get(`/contract/available-payments/${contract.id}`).loginAs(user)
    const paymentDates = response.body() as { month: number; year: number }[]
    expect(paymentDates.length).toBe(3)
    expect(paymentDates[0].month).toBe(2)
    expect(paymentDates[0].year).toBe(2022)
    expect(paymentDates[1].month).toBe(3)
    expect(paymentDates[1].year).toBe(2022)
    expect(paymentDates[2].month).toBe(4)
    expect(paymentDates[2].year).toBe(2022)
  })
  test('Successfully get available payments for contract if endMonth day is lower than startMonth day', async ({
    client,
    expect,
  }) => {
    const user = await createUser()
    const contract = await ContractFactory.merge({
      createdBy: user.id,
      startDate: DateTime.now().set({ year: 2022, month: 1, day: 5 }),
      endDate: DateTime.now().set({ year: 2022, month: 8, day: 3 }),
    })
      .with('isp')
      .with('country')
      .with('currency')
      .with('frequency')
      .create()

    await PaymentFactory.merge([
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 1 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 1 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 2 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 2 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 3 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 3 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
      {
        dateFrom: DateTime.now().set({ year: 2022, month: 4 }).startOf('month'),
        dateTo: DateTime.now().set({ year: 2022, month: 4 }).endOf('month'),
        contractId: contract.id,
        createdBy: user.id,
      },
    ]).createMany(4)
    const response = await client.get(`/contract/available-payments/${contract.id}`).loginAs(user)
    const paymentDates = response.body() as { month: number; year: number }[]
    expect(paymentDates.length).toBe(4)
    expect(paymentDates[0].month).toBe(5)
    expect(paymentDates[0].year).toBe(2022)
    expect(paymentDates[1].month).toBe(6)
    expect(paymentDates[1].year).toBe(2022)
    expect(paymentDates[2].month).toBe(7)
    expect(paymentDates[2].year).toBe(2022)
    expect(paymentDates[3].month).toBe(8)
    expect(paymentDates[3].year).toBe(2022)
  })
  test('Successfully return empty if contract doesnt have payments', async ({ client, expect }) => {
    const user = await createUser()
    const contract = await ContractFactory.merge({
      createdBy: user.id,
      startDate: DateTime.now().set({ year: 2022, month: 1, day: 5 }),
      endDate: DateTime.now().set({ year: 2022, month: 8, day: 3 }),
    })
      .with('isp')
      .with('country')
      .with('currency')
      .with('frequency')
      .create()
    const response = await client.get(`/contract/available-payments/${contract.id}`).loginAs(user)
    const paymentDates = response.body() as { month: number; year: number }[]
    expect(paymentDates.length).toBe(0)
  })
})

const createUser = () => {
  return UserFactory.with('roles', 1, (role) => {
    role
      .merge({
        name: 'Giga Admin',
      })
      .with('permissions', 2, (permission) =>
        permission.merge([{ name: 'contract.read' }, { name: 'payment.read' }])
      )
  }).create()
}

const setupModels = (userId: number) => {
  return ContractFactory.merge({
    createdBy: userId,
    startDate: DateTime.now().set({ year: 2022, month: 1 }).startOf('month'),
    endDate: DateTime.now().set({ year: 2022, month: 8 }).endOf('month'),
  })
    .with('isp')
    .with('country')
    .with('currency')
    .with('frequency')
    .create()
}
