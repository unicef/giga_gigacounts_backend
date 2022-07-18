import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import ContractFactory from 'Database/factories/ContractFactory'
import UserFactory from 'Database/factories/UserFactory'
import CountryFactory from 'Database/factories/CountryFactory'
import IspFactory from 'Database/factories/IspFactory'
import LtaFactory from 'Database/factories/LtaFactory'
import MetricFactory from 'Database/factories/MetricFactory'
import MeasureFactory from 'Database/factories/MeasureFactory'

import { ContractSchoolsDetail } from 'App/DTOs/Contract'

test.group('Schools details by contract', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return schools details by contract with measures', async ({
    client,
    expect,
  }) => {
    const user = await setupUser()
    const contract = await createContract(user.countryId, user.id, [100, 10, 3, 5])
    const response = await client.get(`/contract/schools/${contract.id}`).loginAs(user)
    const schoolsDetails = response.body() as ContractSchoolsDetail[]
    expect(schoolsDetails[0].connection['Download speed']).toBe(3)
    expect(schoolsDetails[0].connection['Upload speed']).toBe(5)
    expect(schoolsDetails[0].connection.Uptime).toBe(100)
    expect(schoolsDetails[0].connection.Latency).toBe(10)
    expect(schoolsDetails[0].connection.value).toBe(100)
  })
  test('Successfully return schools details by contract with some measures low than expected', async ({
    client,
    expect,
  }) => {
    const user = await setupUser()
    const contract = await createContract(user.countryId, user.id, [90, 8, 3, 5])
    const response = await client.get(`/contract/schools/${contract.id}`).loginAs(user)
    const schoolsDetails = response.body() as ContractSchoolsDetail[]
    expect(schoolsDetails[0].connection['Download speed']).toBe(3)
    expect(schoolsDetails[0].connection['Upload speed']).toBe(5)
    expect(schoolsDetails[0].connection.Uptime).toBe(90)
    expect(schoolsDetails[0].connection.Latency).toBe(8)
    expect(schoolsDetails[0].connection.value).toBe(93.5)
  })
  test('Successfully return schools details by contract with no measures', async ({
    client,
    expect,
  }) => {
    const user = await setupUser()
    const contract = await createContract(user.countryId, user.id, [])
    const response = await client.get(`/contract/schools/${contract.id}`).loginAs(user)
    const schoolsDetails = response.body() as ContractSchoolsDetail[]
    expect(schoolsDetails[0].connection['Download speed']).toBe(-1)
    expect(schoolsDetails[0].connection['Upload speed']).toBe(-1)
    expect(schoolsDetails[0].connection.Uptime).toBe(-1)
    expect(schoolsDetails[0].connection.Latency).toBe(-1)
    expect(schoolsDetails[0].connection.value).toBe(-1)
  })
  test('Successfully return schools details by contract with some of the measures on 0', async ({
    client,
    expect,
  }) => {
    const user = await setupUser()
    const contract = await createContract(user.countryId, user.id, [90, 10, 0, 0])
    const response = await client.get(`/contract/schools/${contract.id}`).loginAs(user)
    const schoolsDetails = response.body() as ContractSchoolsDetail[]
    expect(schoolsDetails[0].connection['Download speed']).toBe(0)
    expect(schoolsDetails[0].connection['Upload speed']).toBe(0)
    expect(schoolsDetails[0].connection.Uptime).toBe(90)
    expect(schoolsDetails[0].connection.Latency).toBe(10)
    expect(schoolsDetails[0].connection.value).toBe(46.5)
  })
  test('Successfully return schools details by contract with all measures on 0', async ({
    client,
    expect,
  }) => {
    const user = await setupUser()
    const contract = await createContract(user.countryId, user.id, [0, 0, 0, 0])
    const response = await client.get(`/contract/schools/${contract.id}`).loginAs(user)
    const schoolsDetails = response.body() as ContractSchoolsDetail[]
    expect(schoolsDetails[0].connection['Download speed']).toBe(0)
    expect(schoolsDetails[0].connection['Upload speed']).toBe(0)
    expect(schoolsDetails[0].connection.Uptime).toBe(0)
    expect(schoolsDetails[0].connection.Latency).toBe(0)
    expect(schoolsDetails[0].connection.value).toBe(0)
  })
  test('Throw an error if a contract doesnt exist', async ({ client, expect }) => {
    const user = await setupUser()
    await createContract(user.countryId, user.id, [0, 0, 0, 0])
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

const createContract = async (countryId: number, userId: number, measures: number[]) => {
  const isp = await IspFactory.merge({ name: 'Verizon' }).create()
  const lta = await LtaFactory.merge({
    countryId: countryId,
  }).create()
  const metrics = await MetricFactory.merge([
    {
      name: 'Uptime',
      weight: 35,
    },
    {
      name: 'Latency',
      weight: 15,
    },
    {
      name: 'Download speed',
      weight: 30,
    },
    {
      name: 'Upload speed',
      weight: 20,
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
    .with('schools', 1, (school) => {
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
  if (measures.length) {
    await MeasureFactory.merge([
      {
        metricId: metrics[0].id,
        value: measures[0],
        schoolId: contract.schools[0].id,
        contractId: contract.id,
      },
      {
        metricId: metrics[1].id,
        value: measures[1],
        schoolId: contract.schools[0].id,
        contractId: contract.id,
      },
      {
        metricId: metrics[2].id,
        value: measures[2],
        schoolId: contract.schools[0].id,
        contractId: contract.id,
      },
      {
        metricId: metrics[3].id,
        value: measures[3],
        schoolId: contract.schools[0].id,
        contractId: contract.id,
      },
    ]).createMany(4)
  }

  return contract
}
