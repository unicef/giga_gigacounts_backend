import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import UserFactory from 'Database/factories/UserFactory'
import DraftFactory from 'Database/factories/DraftFactory'
import CountryFactory from 'Database/factories/CountryFactory'
import Draft from 'App/Models/Draft'

test.group('Update Draft', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully update a draft', async ({ client, expect, assert }) => {
    const country = await CountryFactory.create()
    const draft = await DraftFactory.create()
    const user = await createUser()
    const response = await client
      .put('/contract/draft')
      .loginAs(user)
      .json({
        id: draft.id,
        countryId: country.id,
        budget: '100000',
        attachments: { attachments: [{ id: 1 }] },
      })
    const body = response.body() as Draft
    const draftUpdated = await Draft.find(body.id)
    expect(draftUpdated?.name).toBe(draft.name)
    expect(draftUpdated?.countryId).toBe(country.id)
    expect(draftUpdated?.budget).toBe('100000')
    assert.deepEqual(draftUpdated?.attachments, { attachments: [{ id: 1 }] })
    expect(draftUpdated?.ltaId).toBeNull()
    expect(draftUpdated?.currencyId).toBeNull()
    expect(draftUpdated?.frequencyId).toBeNull()
    expect(draftUpdated?.startDate).toBeNull()
    expect(draftUpdated?.endDate).toBeNull()
    expect(draftUpdated?.createdBy).toBeNull()
    expect(draftUpdated?.schools).toBeNull()
    expect(draftUpdated?.expectedMetrics).toBeNull()
  })
  test('Throw an error when a draft doesnt exist', async ({ client, expect }) => {
    const user = await createUser()
    const response = await client.put('/contract/draft').loginAs(user).json({
      id: 1,
      name: 'Wrong Draft',
    })
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(404)
    expect(error.text).toBe('NOT_FOUND: Draft not found')
  })
  test('Dont change name value if is sent as a null', async ({ client, expect }) => {
    const draft = await DraftFactory.create()
    const user = await createUser()
    const response = await client.put('/contract/draft').loginAs(user).json({
      id: draft.id,
      name: null,
    })
    const body = response.body() as Draft
    const draftUpdated = await Draft.find(body.id)
    expect(draftUpdated?.name).toBe(draft.name)
  })
  test('Successfully set a nullable value to null', async ({ client, expect, assert }) => {
    const draft = await DraftFactory.merge({
      budget: '100',
      schools: { schools: [{ id: 1 }] },
    }).create()
    const user = await createUser()
    const response = await client.put('/contract/draft').loginAs(user).json({
      id: draft.id,
      budget: null,
      schools: null,
    })
    const body = response.body() as Draft
    const draftUpdated = await Draft.find(body.id)
    expect(draftUpdated?.budget).toBe(null)
    expect(draftUpdated?.schools).toBe(null)
    assert.deepEqual(draft?.schools, { schools: [{ id: 1 }] })
    expect(draft?.budget).toBe('100')
  })
})

const createUser = () => {
  return UserFactory.with('roles', 1, (role) => {
    role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
  }).create()
}