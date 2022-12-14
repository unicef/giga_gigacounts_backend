import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import ContractFactory from 'Database/factories/ContractFactory'
import UserFactory from 'Database/factories/UserFactory'
import CountryFactory from 'Database/factories/CountryFactory'
import IspFactory from 'Database/factories/IspFactory'
import LtaFactory from 'Database/factories/LtaFactory'
import MetricFactory from 'Database/factories/MetricFactory'
import MeasureFactory from 'Database/factories/MeasureFactory'
import PaymentFactory from 'Database/factories/PaymentFactory'

import { ContractDetails } from 'App/DTOs/Contract'

test.group('Contract Details', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return contract details', async ({ client, expect }) => {
    const user = await setupUser()
    const contract = await createContract(user.countryId, user.id)
    const response = await client.get(`/contract/details/${contract.id}`).loginAs(user)
    const contractDetails = response.body() as ContractDetails
    expect(contractDetails.numberOfSchools).toBe('2')
    expect(contractDetails.isp).toBe('Verizon')
    expect(contractDetails.schoolsConnection?.withoutConnection).toBe(0)
    expect(contractDetails.schoolsConnection?.atLeastOneBellowAvg).toBe(50)
    expect(contractDetails.schoolsConnection?.allEqualOrAboveAvg).toBe(50)
    expect(contractDetails.attachments?.length).toBe(1)
    for (const connection of contractDetails.connectionsMedian) {
      if (connection.metric_name === 'Uptime') expect(connection.median_value).toBe(95)
      if (connection.metric_name === 'Latency') expect(connection.median_value).toBe(9)
      if (connection.metric_name === 'Download speed') expect(connection.median_value).toBe(3)
      if (connection.metric_name === 'Upload speed') expect(connection.median_value).toBe(5)
    }
    expect(contractDetails.budget).toBe('100000')
    expect(contractDetails.numberOfPayments).toBe('4')
    expect(contractDetails.currency.name).toBe('US Dollar')
    expect(contractDetails.currency.code).toBe('USD')
    expect(contractDetails.totalSpent.amount).toBe('17000')
    expect(contractDetails.totalSpent.percentage).toBe(17)
  })
  test('Throw an error if a contract doesnt exist', async ({ client, expect }) => {
    const user = await setupUser()
    await createContract(user.countryId, user.id)
    const response = await client.get('/contract/details/3001').loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(404)
    expect(error.text).toBe('NOT_FOUND: Contract not found')
  })
  test('Successfully return contract details with rounded total payment', async ({
    client,
    expect,
  }) => {
    const user = await setupUser()
    const contract = await createContract(user.countryId, user.id, false)
    const response = await client.get(`/contract/details/${contract.id}`).loginAs(user)
    const contractDetails = response.body() as ContractDetails
    expect(contractDetails.numberOfSchools).toBe('2')
    expect(contractDetails.isp).toBe('Verizon')
    expect(contractDetails.schoolsConnection?.withoutConnection).toBe(0)
    expect(contractDetails.schoolsConnection?.atLeastOneBellowAvg).toBe(50)
    expect(contractDetails.schoolsConnection?.allEqualOrAboveAvg).toBe(50)
    expect(contractDetails.attachments?.length).toBe(1)
    for (const connection of contractDetails.connectionsMedian) {
      if (connection.metric_name === 'Uptime') expect(connection.median_value).toBe(95)
      if (connection.metric_name === 'Latency') expect(connection.median_value).toBe(9)
      if (connection.metric_name === 'Download speed') expect(connection.median_value).toBe(3)
      if (connection.metric_name === 'Upload speed') expect(connection.median_value).toBe(5)
    }
    expect(contractDetails.budget).toBe('100000')
    expect(contractDetails.numberOfPayments).toBe('4')
    expect(contractDetails.currency.name).toBe('US Dollar')
    expect(contractDetails.currency.code).toBe('USD')
    expect(contractDetails.totalSpent.amount).toBe('16333')
    expect(contractDetails.totalSpent.percentage).toBe(16)
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

const createContract = async (countryId: number, userId: number, roundPayment: boolean = true) => {
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
      budget: '100000',
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

  await PaymentFactory.merge([
    {
      amount: 10000,
      invoiceId: contract.attachments[0].id,
      createdBy: userId,
      contractId: contract.id,
      currencyId: contract.currencyId,
    },
    {
      amount: 1000,
      invoiceId: contract.attachments[0].id,
      createdBy: userId,
      contractId: contract.id,
      currencyId: contract.currencyId,
    },
    {
      amount: 5000,
      invoiceId: contract.attachments[0].id,
      createdBy: userId,
      contractId: contract.id,
      currencyId: contract.currencyId,
    },
    {
      amount: roundPayment ? 1000 : 333,
      invoiceId: contract.attachments[0].id,
      createdBy: userId,
      contractId: contract.id,
      currencyId: contract.currencyId,
    },
  ]).createMany(4)

  return contract
}
