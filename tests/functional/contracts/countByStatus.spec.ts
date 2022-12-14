import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import ContractFactory from 'Database/factories/ContractFactory'
import UserFactory from 'Database/factories/UserFactory'
import CountryFactory from 'Database/factories/CountryFactory'
import IspFactory from 'Database/factories/IspFactory'
import DraftFactory from 'Database/factories/DraftFactory'

import { ContractsStatusCount } from 'App/DTOs/Contract'

test.group('Contract count by status', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully count only contracts at a certain country if the user is an country office', async ({
    client,
    expect,
  }) => {
    const [country1, country2] = await setupCountries()
    const user = await UserFactory.merge({ countryId: country1.id })
      .with('roles', 1, (role) =>
        role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.read' }))
      )
      .create()
    await setupModels(country1.id, country2.id, user.id)
    const response = await client.get('/contract/count/status').loginAs(user)
    const statusCount = response.body() as ContractsStatusCount
    expect(statusCount.totalCount).toBe(3)
    expect(statusCount.counts[0].status).toBe('Draft')
    expect(statusCount.counts[0].count).toBe('1')
    expect(statusCount.counts[1].status).toBe('Sent')
    expect(statusCount.counts[1].count).toBe('1')
    expect(statusCount.counts[3].status).toBe('Ongoing')
    expect(statusCount.counts[3].count).toBe('1')
  })
  test('Successfully counts all contracts if the user is admin', async ({ client, expect }) => {
    const [country1, country2] = await setupCountries()
    const user = await UserFactory.with('roles', 1, (role) => {
      role
        .merge({
          name: 'Giga Admin',
        })
        .with('permissions', 1, (permission) => permission.merge({ name: 'contract.read' }))
    }).create()
    await setupModels(country1.id, country2.id, user.id)
    const response = await client.get('/contract/count/status').loginAs(user)
    const statusCount = response.body() as ContractsStatusCount
    expect(statusCount.totalCount).toBe(4)
    for (const count of statusCount.counts) {
      if (count.status === 'Draft') expect(count.count).toBe('2')
      if (count.status === 'Sent') expect(count.count).toBe('1')
      if (count.status === 'Ongoing') expect(count.count).toBe('1')
    }
  })
  test('Successfully counts only contracts from the same isp and country if the user is an isp', async ({
    client,
    expect,
  }) => {
    const [country1, country2] = await setupCountries()
    const user = await UserFactory.merge({ countryId: country1.id })
      .with('roles', 1, (role) => {
        role
          .merge({
            name: 'ISP',
          })
          .with('permissions', 1, (permission) => permission.merge({ name: 'contract.read' }))
      })
      .with('isp')
      .create()
    await setupModels(country1.id, country2.id, user.id, user.isp[0].id)
    const response = await client.get('/contract/count/status').loginAs(user)
    const statusCount = response.body() as ContractsStatusCount
    expect(statusCount.totalCount).toBe(1)
    expect(statusCount.counts[0].status).toBe('Draft')
    expect(statusCount.counts[0].count).toBe('1')
  })
  test('Successfully counts only contracts from the same country and is on gov behalf if the user is a gov', async ({
    client,
    expect,
  }) => {
    const [country1, country2] = await setupCountries()
    const user = await UserFactory.merge({ countryId: country1.id })
      .with('roles', 1, (role) => {
        role
          .merge({
            name: 'Government',
          })
          .with('permissions', 1, (permission) => permission.merge({ name: 'contract.read' }))
      })
      .create()
    await setupModels(country1.id, country2.id, user.id)
    const response = await client.get('/contract/count/status').loginAs(user)
    const statusCount = response.body() as ContractsStatusCount
    expect(statusCount.totalCount).toBe(1)
    expect(statusCount.counts[3].status).toBe('Ongoing')
    expect(statusCount.counts[3].count).toBe('1')
  })
})

const setupCountries = async () => {
  const country1 = await CountryFactory.create()
  const country2 = await CountryFactory.merge({ name: 'Country 2' }).create()
  return [country1, country2]
}

const setupModels = async (
  countryId: number,
  otherCountry: number,
  userId: number,
  ispId?: number
) => {
  const isp = await IspFactory.merge({ name: 'Verizon' }).create()
  const isp1 = await IspFactory.create()
  await DraftFactory.merge([
    {
      countryId: countryId,
      createdBy: userId,
      ispId: ispId || isp.id,
    },
    {
      countryId: otherCountry,
      createdBy: userId,
      ispId: isp1.id,
      governmentBehalf: true,
    },
  ])
    .with('currency')
    .with('frequency')
    .createMany(2)
  await ContractFactory.merge([
    {
      countryId: countryId,
      status: 1,
      createdBy: userId,
      ispId: isp1.id,
    },
    {
      countryId: countryId,
      status: 3,
      createdBy: userId,
      ispId: isp1.id,
      governmentBehalf: true,
    },
  ])
    .with('currency')
    .with('frequency')
    .createMany(2)
}
