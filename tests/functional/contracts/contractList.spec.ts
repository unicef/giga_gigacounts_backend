import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import ContractFactory from 'Database/factories/ContractFactory'
import UserFactory from 'Database/factories/UserFactory'
import CountryFactory from 'Database/factories/CountryFactory'
import IspFactory from 'Database/factories/IspFactory'
import DraftFactory from 'Database/factories/DraftFactory'
import LtaFactory from 'Database/factories/LtaFactory'
import MetricFactory from 'Database/factories/MetricFactory'
import AttachmentFactory from 'Database/factories/AttachmentFactory'

import { ContractListDTO } from 'App/DTOs/Contract'

test.group('Contract List', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return all contracts of a specific country', async ({ client, expect }) => {
    const [country1, country2] = await setupCountries()
    const user = await UserFactory.merge({ countryId: country1.id })
      .with('roles', 1, (role) =>
        role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.read' }))
      )
      .create()
    await setupModels(country1.id, country2.id, user.id)
    const response = await client.get('/contract').loginAs(user)
    const contractList = response.body() as ContractListDTO
    for (const lta of Object.values(contractList.ltas)) {
      expect(lta[0].country?.name).toBe('Testland')
      expect(lta[0].schoolsConnection?.withoutConnection).toBe(1)
      expect(lta[0].schoolsConnection?.atLeastOneBellowAvg).toBe(0)
      expect(lta[0].schoolsConnection?.allEqualOrAboveAvg).toBe(0)
      expect(lta[0].numberOfSchools).toBe('1')
    }
    expect(contractList.contracts.length).toBe(2)
    expect(contractList.contracts[0].status).toBe('Draft')
    expect(contractList.contracts[1].status).toBe('Ongoing')
    expect(contractList.contracts[1].schoolsConnection?.withoutConnection).toBe(0)
    expect(contractList.contracts[1].schoolsConnection?.atLeastOneBellowAvg).toBe(0)
    expect(contractList.contracts[1].schoolsConnection?.allEqualOrAboveAvg).toBe(1)
    expect(contractList.contracts[1].numberOfSchools).toBe('1')
  })
  test('Successfully return all contracts that are government behalf for a specific country', async ({
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
    const response = await client.get('/contract').loginAs(user)
    const contractList = response.body() as ContractListDTO
    for (const lta of Object.values(contractList.ltas)) {
      expect(lta.length).toBe(0)
    }
    expect(contractList.contracts.length).toBe(1)
    expect(contractList.contracts[0].status).toBe('Ongoing')
    expect(contractList.contracts[0].schoolsConnection?.withoutConnection).toBe(0)
    expect(contractList.contracts[0].schoolsConnection?.atLeastOneBellowAvg).toBe(0)
    expect(contractList.contracts[0].schoolsConnection?.allEqualOrAboveAvg).toBe(1)
    expect(contractList.contracts[0].numberOfSchools).toBe('1')
  })
  test('Successfully return all contract for a specific ISP', async ({
    client,
    expect,
    assert,
  }) => {
    const [country1, country2] = await setupCountries()
    const user = await UserFactory.merge({ name: 'Verizon', countryId: country1.id })
      .with('roles', 1, (role) => {
        role
          .merge({
            name: 'ISP',
          })
          .with('permissions', 1, (permission) => permission.merge({ name: 'contract.read' }))
      })
      .create()
    await setupModels(country1.id, country2.id, user.id)
    const response = await client.get('/contract').loginAs(user)
    const contractList = response.body() as ContractListDTO
    assert.isEmpty(contractList.ltas)
    expect(contractList.contracts.length).toBe(2)
    expect(contractList.contracts[0].status).toBe('Draft')
    expect(contractList.contracts[0].isp).toBe('Verizon')
    expect(contractList.contracts[1].status).toBe('Ongoing')
    expect(contractList.contracts[1].isp).toBe('Verizon')
    expect(contractList.contracts[1].schoolsConnection?.withoutConnection).toBe(0)
    expect(contractList.contracts[1].schoolsConnection?.atLeastOneBellowAvg).toBe(0)
    expect(contractList.contracts[1].schoolsConnection?.allEqualOrAboveAvg).toBe(1)
    expect(contractList.contracts[1].numberOfSchools).toBe('1')
  })
  test('Successfully return all contracts if the user is admin', async ({ client, expect }) => {
    const [country1, country2] = await setupCountries()
    const user = await UserFactory.with('roles', 1, (role) => {
      role
        .merge({
          name: 'Giga Admin',
        })
        .with('permissions', 1, (permission) => permission.merge({ name: 'contract.read' }))
    }).create()
    await setupModels(country1.id, country2.id, user.id)
    const response = await client.get('/contract').loginAs(user)
    const contractList = response.body() as ContractListDTO
    expect(Object.keys(contractList.ltas).length).toBe(2)
    expect(contractList.contracts.length).toBe(3)
    expect(contractList.contracts[0].status).toBe('Draft')
    expect(contractList.contracts[1].status).toBe('Draft')
    expect(contractList.contracts[2].status).toBe('Ongoing')
    expect(contractList.contracts[2].isp).toBe('Verizon')
    expect(contractList.contracts[2].schoolsConnection?.withoutConnection).toBe(0)
    expect(contractList.contracts[2].schoolsConnection?.atLeastOneBellowAvg).toBe(0)
    expect(contractList.contracts[2].schoolsConnection?.allEqualOrAboveAvg).toBe(1)
    expect(contractList.contracts[2].numberOfSchools).toBe('1')
    expect(contractList.contracts[2].budget?.budget).toBe('10000')
    expect(contractList.contracts[2].budget?.totalSpend).toBe('1500')
  })
})

const setupCountries = async () => {
  const country1 = await CountryFactory.create()
  const country2 = await CountryFactory.merge({ name: 'Country 2' }).create()
  return [country1, country2]
}

const setupModels = async (countryId: number, otherCountry: number, userId: number) => {
  const isp = await IspFactory.merge({ name: 'Verizon' }).create()
  const isp1 = await IspFactory.create()

  const ltaOne = await LtaFactory.merge({
    countryId: countryId,
  }).create()
  const ltaTwo = await LtaFactory.merge({
    countryId: otherCountry,
  }).create()

  await DraftFactory.merge([
    {
      countryId: countryId,
      createdBy: userId,
      ispId: isp.id,
    },
    {
      countryId: otherCountry,
      createdBy: userId,
      ispId: undefined,
    },
  ]).createMany(2)

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

  const attch = await AttachmentFactory.create()

  await ContractFactory.merge([
    {
      countryId: countryId,
      status: 3,
      createdBy: userId,
      ispId: isp.id,
      governmentBehalf: true,
    },
  ])
    .with('currency')
    .with('frequency')
    .with('schools', 1, (school) => {
      school
        .merge({
          countryId: countryId,
        })
        .with('measures', 4, (m) => {
          m.merge([
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
    .with('payments', 2, (pay) => {
      pay.merge([
        {
          amount: 1000,
          invoiceId: attch.id,
        },
        {
          amount: 500,
          invoiceId: attch.id,
        },
      ])
    })
    .create()

  await ContractFactory.merge([
    {
      countryId: countryId,
      status: 1,
      createdBy: userId,
      ispId: isp1.id,
      ltaId: ltaOne.id,
    },
  ])
    .with('currency')
    .with('frequency')
    .with('schools', 1, (school) => school.merge({ countryId: countryId }))
    .create()

  await ContractFactory.merge([
    {
      countryId: otherCountry,
      status: 3,
      createdBy: userId,
      ispId: isp.id,
      ltaId: ltaTwo.id,
    },
  ])
    .with('schools', 1, (school) => {
      school
        .merge({
          countryId: otherCountry,
        })
        .with('measures', 4, (m) => {
          m.merge([
            {
              metricId: metrics[0].id,
              value: 100,
            },
            {
              metricId: metrics[1].id,
              value: 5,
            },
            {
              metricId: metrics[2].id,
              value: 1,
            },
            {
              metricId: metrics[3].id,
              value: 5,
            },
          ])
        })
    })
    .with('schools', 1, (school) => {
      school.merge({
        countryId: otherCountry,
      })
    })
    .with('schools', 1, (school) => {
      school
        .merge({
          countryId: otherCountry,
        })
        .with('measures', 4, (m) => {
          m.merge([
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
    })
    .with('currency')
    .with('frequency')
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
}
