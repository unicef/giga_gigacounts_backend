import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import ContractFactory from 'Database/factories/ContractFactory'
import UserFactory from 'Database/factories/UserFactory'
import CountryFactory from 'Database/factories/CountryFactory'
import IspFactory from 'Database/factories/IspFactory'
import LtaFactory from 'Database/factories/LtaFactory'
import MetricFactory from 'Database/factories/MetricFactory'
import MeasureFactory from 'Database/factories/MeasureFactory'

import { ContractDTO } from 'App/DTOs/Contract'

test.group('Get Contract', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return contract', async ({ client, expect, assert }) => {
    const user = await setupUser()
    const contract = await createContract(user.countryId, user.id)
    const response = await client.get(`/contract/${contract.id}`).loginAs(user)
    const contractResponse = response.body() as ContractDTO
    assert.isNotEmpty(contractResponse.id)
    assert.isNotEmpty(contractResponse.name)
    assert.isNotEmpty(contractResponse.isp)
    assert.isNotEmpty(contractResponse.lta)
    expect(contractResponse.attachments?.length).toBe(1)
    assert.isNotEmpty(contractResponse.startDate)
    assert.isNotEmpty(contractResponse.endDate)
    assert.isNotEmpty(contractResponse.status)
    expect(contractResponse.country?.name).toBe('Testland')
    expect(contractResponse.expectedMetrics.length).toBe(4)
    assert.isNotEmpty(contractResponse.budget)
    expect(contractResponse.schools.length).toBe(2)
  })
  test('Throw an error if a contract doesnt exist', async ({ client, expect }) => {
    const user = await setupUser()
    await createContract(user.countryId, user.id)
    const response = await client.get('/contract/3001').loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(404)
    expect(error.text).toBe('NOT_FOUND: Contract not found')
  })
})

const setupUser = async () => {
  const country = await CountryFactory.create()
  return UserFactory.merge({ countryId: country.id })
    .with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.read' }))
    )
    .create()
}

const createContract = async (countryId: number, userId: number) => {
  const isp = await IspFactory.merge({ name: 'Verizon' }).create()
  const lta = await LtaFactory.merge({
    countryId: countryId,
  }).create()

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
      ispId: isp.id,
      ltaId: lta.id,
    },
  ])
    .with('currency')
    .with('frequency')
    .with('attachments')
    .with('schools', 2, (school) => {
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

  await MeasureFactory.merge([
    {
      metricId: metrics[0].id,
      value: 100,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
    },
    {
      metricId: metrics[1].id,
      value: 10,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
    },
    {
      metricId: metrics[2].id,
      value: 3,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
    },
    {
      metricId: metrics[3].id,
      value: 5,
      schoolId: contract.schools[0].id,
      contractId: contract.id,
    },
    {
      metricId: metrics[0].id,
      value: 90,
      schoolId: contract.schools[1].id,
      contractId: contract.id,
    },
    {
      metricId: metrics[1].id,
      value: 8,
      schoolId: contract.schools[1].id,
      contractId: contract.id,
    },
    {
      metricId: metrics[2].id,
      value: 3,
      schoolId: contract.schools[1].id,
      contractId: contract.id,
    },
    {
      metricId: metrics[3].id,
      value: 5,
      schoolId: contract.schools[1].id,
      contractId: contract.id,
    },
  ]).createMany(8)

  return contract
}
