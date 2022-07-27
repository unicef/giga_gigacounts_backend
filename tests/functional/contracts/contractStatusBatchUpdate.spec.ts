import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import ContractFactory from 'Database/factories/ContractFactory'
import UserFactory from 'Database/factories/UserFactory'
import CountryFactory from 'Database/factories/CountryFactory'
import IspFactory from 'Database/factories/IspFactory'

import { BatchUpdate } from 'App/Services/Contract'
import Contract from 'App/Models/Contract'

test.group('Contract Status Batch Update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully update the status of contracts that the start and end date has passed', async ({
    client,
    expect,
  }) => {
    const user = await setupUser()
    await createContracts(user.countryId, user.id)
    const response = await client.patch('/contract/batch').loginAs(user)
    const batchBody = response.body() as BatchUpdate
    expect(batchBody.confirmedContracts[0]).toBe(2)
    expect(batchBody.ongoingContracts[0]).toBe(2)
  })
  test('Successfully update the status of contracts that the start and end date has passed only once', async ({
    client,
    expect,
  }) => {
    const user = await setupUser()
    await createContracts(user.countryId, user.id)
    let response = await client.patch('/contract/batch').loginAs(user)
    let batchBody = response.body() as BatchUpdate
    expect(batchBody.confirmedContracts[0]).toBe(2)
    expect(batchBody.ongoingContracts[0]).toBe(2)
    response = await client.patch('/contract/batch').loginAs(user)
    batchBody = response.body() as BatchUpdate
    expect(batchBody.confirmedContracts[0]).toBe(0)
    expect(batchBody.ongoingContracts[0]).toBe(0)
  })
  test('Successfully update all sent contracts to confirmed', async ({ client, expect }) => {
    const user = await setupUser()
    await createContracts(user.countryId, user.id)
    const response = await client.patch('/contract/batch').loginAs(user)
    const batchBody = response.body() as BatchUpdate
    expect(batchBody.confirmedContracts[0]).toBe(2)
    expect(batchBody.ongoingContracts[0]).toBe(2)
    expect(batchBody.sentContracts[0]).toBe(1)
  })
  test('Successfully update a sent contract to confirmed and ongoing if the start date has passed', async ({
    client,
    expect,
  }) => {
    const user = await setupUser()
    await createContracts(user.countryId, user.id)
    const contract = await ContractFactory.merge({
      countryId: user.countryId,
      status: 1,
      createdBy: user.id,
      startDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .minus({ days: 2 }),
      endDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .plus({ days: 10 }),
    })
      .with('currency')
      .with('frequency')
      .with('isp')
      .create()
    const response = await client.patch('/contract/batch').loginAs(user)
    const batchBody = response.body() as BatchUpdate
    expect(batchBody.confirmedContracts[0]).toBe(3)
    expect(batchBody.ongoingContracts[0]).toBe(2)
    expect(batchBody.sentContracts[0]).toBe(2)
    const fetchedContract = await Contract.find(contract.id)
    expect(fetchedContract?.status).toBe(3)
  })
})

const setupUser = async () => {
  const country = await CountryFactory.create()
  return UserFactory.merge({ countryId: country.id })
    .with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    )
    .create()
}

const createContracts = async (countryId: number, userId: number) => {
  const isp = await IspFactory.merge({ name: 'Verizon' }).create()

  await ContractFactory.merge([
    {
      countryId: countryId,
      status: 2,
      createdBy: userId,
      ispId: isp.id,
      startDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .minus({ days: 1 }),
      endDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .plus({ days: 10 }),
    },
    {
      countryId: countryId,
      status: 2,
      createdBy: userId,
      ispId: isp.id,
      startDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .minus({ days: 2 }),
      endDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .plus({ days: 10 }),
    },
    {
      countryId: countryId,
      status: 2,
      createdBy: userId,
      ispId: isp.id,
      startDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .plus({ days: 1 }),
      endDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .plus({ days: 10 }),
    },
    {
      countryId: countryId,
      status: 3,
      createdBy: userId,
      ispId: isp.id,
      startDate: DateTime.now().set({ hour: 0, millisecond: 0, minute: 0, second: 0 }),
      endDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .minus({ days: 1 }),
    },
    {
      countryId: countryId,
      status: 3,
      createdBy: userId,
      ispId: isp.id,
      startDate: DateTime.now().set({ hour: 0, millisecond: 0, minute: 0, second: 0 }),
      endDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .minus({ days: 1 }),
    },
    {
      countryId: countryId,
      status: 3,
      createdBy: userId,
      ispId: isp.id,
      startDate: DateTime.now().set({ hour: 0, millisecond: 0, minute: 0, second: 0 }),
      endDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .plus({ days: 10 }),
    },
    {
      countryId: countryId,
      status: 1,
      createdBy: userId,
      ispId: isp.id,
      startDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .plus({ days: 2 }),
      endDate: DateTime.now()
        .set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
        .plus({ days: 10 }),
    },
  ])
    .with('currency')
    .with('frequency')
    .createMany(7)
}
