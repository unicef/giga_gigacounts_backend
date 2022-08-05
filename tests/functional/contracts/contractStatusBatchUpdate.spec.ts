import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import ContractFactory from 'Database/factories/ContractFactory'
import UserFactory from 'Database/factories/UserFactory'
import CountryFactory from 'Database/factories/CountryFactory'
import IspFactory from 'Database/factories/IspFactory'

import testUtils from '../../utils'

import { BatchUpdate } from 'App/Services/Contract'
import Contract from 'App/Models/Contract'
import StatusTransition from 'App/Models/StatusTransition'

test.group('Contract Status Batch Update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully update the status of contracts that the start and end date has passed', async ({
    client,
    expect,
    assert,
  }) => {
    const user = await setupUser()
    await createContracts(user.countryId, user.id)
    await user.load('country')
    const response = await client.patch('/contract/batch').loginAs(user)
    const batchBody = response.body() as BatchUpdate
    expect(batchBody.confirmedContracts.length).toBe(2)
    expect(batchBody.ongoingContracts.length).toBe(2)
    expect(testUtils.checkAllMocksCalled()).toBe(true)
    const confirmedTrxs = await StatusTransition.query().where('initial_status', 2)
    const ongoingTrxs = await StatusTransition.query().where('initial_status', 3)
    expect(confirmedTrxs.length).toBe(2)
    for (const trx of confirmedTrxs) {
      expect(trx.initialStatus).toBe(2)
      expect(trx.finalStatus).toBe(3)
      assert.isNotNull(trx.id)
      assert.isNotNull(trx.contractId)
    }
    expect(ongoingTrxs.length).toBe(2)
    for (const trx of ongoingTrxs) {
      expect(trx.initialStatus).toBe(3)
      expect(trx.finalStatus).toBe(4)
      assert.isNotNull(trx.id)
      assert.isNotNull(trx.contractId)
    }
  })
  test('Successfully update the status of contracts that the start and end date has passed only once', async ({
    client,
    expect,
    assert,
  }) => {
    const user = await setupUser()
    await createContracts(user.countryId, user.id)
    let response = await client.patch('/contract/batch').loginAs(user)
    let batchBody = response.body() as BatchUpdate
    expect(batchBody.confirmedContracts.length).toBe(2)
    expect(batchBody.ongoingContracts.length).toBe(2)
    const confirmedTrxs = await StatusTransition.query().where('initial_status', 2)
    const ongoingTrxs = await StatusTransition.query().where('initial_status', 3)
    expect(confirmedTrxs.length).toBe(2)
    for (const trx of confirmedTrxs) {
      expect(trx.initialStatus).toBe(2)
      expect(trx.finalStatus).toBe(3)
      assert.isNotNull(trx.id)
      assert.isNotNull(trx.contractId)
    }
    expect(ongoingTrxs.length).toBe(2)
    for (const trx of ongoingTrxs) {
      expect(trx.initialStatus).toBe(3)
      expect(trx.finalStatus).toBe(4)
      assert.isNotNull(trx.id)
      assert.isNotNull(trx.contractId)
    }
    response = await client.patch('/contract/batch').loginAs(user)
    batchBody = response.body() as BatchUpdate
    expect(batchBody.confirmedContracts.length).toBe(0)
    expect(batchBody.ongoingContracts.length).toBe(0)
  })
  test('Successfully update all sent contracts to confirmed', async ({
    client,
    expect,
    assert,
  }) => {
    const user = await setupUser()
    await createContracts(user.countryId, user.id)
    const response = await client.patch('/contract/batch').loginAs(user)
    const batchBody = response.body() as BatchUpdate
    expect(batchBody.confirmedContracts.length).toBe(2)
    expect(batchBody.ongoingContracts.length).toBe(2)
    expect(batchBody.sentContracts.length).toBe(1)
    const confirmedTrxs = await StatusTransition.query().where('initial_status', 2)
    const ongoingTrxs = await StatusTransition.query().where('initial_status', 3)
    const sentTrxs = await StatusTransition.query().where('initial_status', 1)
    expect(confirmedTrxs.length).toBe(2)
    for (const trx of confirmedTrxs) {
      expect(trx.initialStatus).toBe(2)
      expect(trx.finalStatus).toBe(3)
      assert.isNotNull(trx.id)
      assert.isNotNull(trx.contractId)
    }
    expect(ongoingTrxs.length).toBe(2)
    for (const trx of ongoingTrxs) {
      expect(trx.initialStatus).toBe(3)
      expect(trx.finalStatus).toBe(4)
      assert.isNotNull(trx.id)
      assert.isNotNull(trx.contractId)
    }
    expect(sentTrxs.length).toBe(1)
    for (const trx of sentTrxs) {
      expect(trx.initialStatus).toBe(1)
      expect(trx.finalStatus).toBe(2)
      assert.isNotNull(trx.id)
      assert.isNotNull(trx.contractId)
    }
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
    expect(batchBody.confirmedContracts.length).toBe(3)
    expect(batchBody.ongoingContracts.length).toBe(2)
    expect(batchBody.sentContracts.length).toBe(2)
    const fetchedContract = await Contract.find(contract.id)
    expect(fetchedContract?.status).toBe(3)
  })
})

const setupUser = async () => {
  const country = await CountryFactory.apply('random').create()
  return UserFactory.merge({ countryId: country.id })
    .with('roles', 1, (role) =>
      role
        .apply('random')
        .with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
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
