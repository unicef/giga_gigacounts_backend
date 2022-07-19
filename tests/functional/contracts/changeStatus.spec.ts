import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import UserFactory from 'Database/factories/UserFactory'
import ContractFactory from 'Database/factories/ContractFactory'

import Contract from 'App/Models/Contract'
import StatusTransition from 'App/Models/StatusTransition'
import User from 'App/Models/User'
import { ApiClient } from '@japa/api-client'

test.group('Change status', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully change a contract from Sent to Confirmed', async ({ client, expect }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    ).create()
    const contract = await createContract(1, user.id)
    expect(contract.status).toBe(1)
    const response = await makeRequest(client, contract.id.toString(), user, 2)
    const contractUpdated = response.body() as Contract
    expect(contractUpdated.status).toBe(2)
    const statusTransition = await StatusTransition.findBy('contract_id', contract.id)
    expect(statusTransition?.contractId).toBe(contract.id)
    expect(statusTransition?.who).toBe(user.id)
    expect(statusTransition?.initialStatus).toBe(1)
    expect(statusTransition?.finalStatus).toBe(2)
  })
  test('Successfully change a contract from Confimed to Ongoing', async ({ client, expect }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    ).create()
    const contract = await createContract(2, user.id)
    expect(contract.status).toBe(2)
    const response = await makeRequest(client, contract.id.toString(), user, 3)
    const contractUpdated = response.body() as Contract
    expect(contractUpdated.status).toBe(3)
    const statusTransition = await StatusTransition.findBy('contract_id', contract.id)
    expect(statusTransition?.contractId).toBe(contract.id)
    expect(statusTransition?.who).toBe(user.id)
    expect(statusTransition?.initialStatus).toBe(2)
    expect(statusTransition?.finalStatus).toBe(3)
  })
  test('Successfully change a contract from Ongoing to Expired', async ({ client, expect }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    ).create()
    const contract = await createContract(3, user.id)
    expect(contract.status).toBe(3)
    const response = await makeRequest(client, contract.id.toString(), user, 4)
    const contractUpdated = response.body() as Contract
    expect(contractUpdated.status).toBe(4)
    const statusTransition = await StatusTransition.findBy('contract_id', contract.id)
    expect(statusTransition?.contractId).toBe(contract.id)
    expect(statusTransition?.who).toBe(user.id)
    expect(statusTransition?.initialStatus).toBe(3)
    expect(statusTransition?.finalStatus).toBe(4)
  })
  test('Successfully change a contract from Expired to Completed', async ({ client, expect }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    ).create()
    const contract = await createContract(4, user.id)
    expect(contract.status).toBe(4)
    const response = await makeRequest(client, contract.id.toString(), user, 5)
    const contractUpdated = response.body() as Contract
    expect(contractUpdated.status).toBe(5)
    const statusTransition = await StatusTransition.findBy('contract_id', contract.id)
    expect(statusTransition?.contractId).toBe(contract.id)
    expect(statusTransition?.who).toBe(user.id)
    expect(statusTransition?.initialStatus).toBe(4)
    expect(statusTransition?.finalStatus).toBe(5)
  })
  test('Throw an error when tries to jump a status', async ({ client, expect }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    ).create()
    const contract = await createContract(1, user.id)
    const response = await makeRequest(client, contract.id.toString(), user, 3)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(400)
    expect(error.text).toBe('INVALID_STATUS: Invalid status')
  })
  test('Throw an error when is passed an invalid contract id', async ({ client, expect }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    ).create()
    await createContract(1, user.id)
    const response = await makeRequest(client, '0', user, 2)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(404)
    expect(error.text).toBe('NOT_FOUND: Contract not found')
  })
  test('Throw an error when passes an invalid status', async ({ client, expect }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    ).create()
    const contract = await createContract(1, user.id)
    const response = await makeRequest(client, contract.id.toString(), user, 10)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(400)
    expect(error.text).toBe('INVALID_STATUS: Invalid status')
  })
})

const createContract = async (status: number, userId: number): Promise<Contract> => {
  const contract = await ContractFactory.merge({
    createdBy: userId,
    status: status,
  })
    .with('country')
    .with('currency')
    .with('frequency')
    .with('isp')
    .create()
  return contract
}

const makeRequest = async (client: ApiClient, contractId: string, user: User, status: number) => {
  const response = await client
    .post('/contract/change-status')
    .json({
      contract_id: contractId,
      status: status,
    })
    .loginAs(user)
  return response
}
