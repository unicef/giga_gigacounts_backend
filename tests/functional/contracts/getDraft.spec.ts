import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import DraftFactory from 'Database/factories/DraftFactory'
import SchoolFactory from 'Database/factories/SchoolFactory'
import CountryFactory from 'Database/factories/CountryFactory'
import UserFactory from 'Database/factories/UserFactory'

import { GetDraftDTOResponse } from 'App/DTOs/Draft'

test.group('Get Draft', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully get a contract', async ({ client, expect }) => {
    const country = await CountryFactory.create()
    const user = await UserFactory.merge({ countryId: country.id })
      .with('roles', 1, (role) =>
        role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.read' }))
      )
      .create()
    const school = await SchoolFactory.merge({ countryId: country.id }).create()
    const draft = await DraftFactory.merge({
      countryId: country.id,
      schools: { schools: [{ id: school.id }] },
    })
      .with('currency')
      .with('frequency')
      .with('isp')
      .create()
    const response = await client.get(`/contract/draft/${draft.id}`).loginAs(user)
    const draftResponse = response.body() as GetDraftDTOResponse
    expect(draftResponse.id).toBe(draft.id)
    expect(draftResponse.name).toBe(draft.name)
    expect(draftResponse.governmentBehalf).toBe(false)
    expect(draftResponse.budget).toBe(null)
    expect(draftResponse.startDate).toBe(null)
    expect(draftResponse.endDate).toBe(null)
    expect(draftResponse?.country?.name).toBe(country.name)
    expect(draftResponse?.frequency?.name).toBe('Monthly')
    expect(draftResponse?.currency?.name).toBe('US Dollar')
    expect(draftResponse?.isp?.name).toBe('T-Mobile')
    expect(draftResponse.createdBy).toBe(null)
    expect(draftResponse.attachments).toStrictEqual([])
    expect(draftResponse.expectedMetrics).toStrictEqual([])
    expect((draftResponse?.schools || [])[0].name).toBe(school.name)
  })
  test('Throw an error if a contract doesnt exist', async ({ client, expect }) => {
    const country = await CountryFactory.create()
    const user = await UserFactory.merge({ countryId: country.id })
      .with('roles', 1, (role) =>
        role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.read' }))
      )
      .create()
    const response = await client.get(`/contract/draft/2`).loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(404)
    expect(error.text).toBe('NOT_FOUND: Draft not found')
  })
})
