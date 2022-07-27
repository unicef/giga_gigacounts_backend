import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import UserFactory from 'Database/factories/UserFactory'
import DraftFactory from 'Database/factories/DraftFactory'
import Draft from 'App/Models/Draft'
import Attachment from 'App/Models/Attachment'

test.group('Delete Draft', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully delete a draft', async ({ client, assert }) => {
    const user = await createUser()
    const draft = await DraftFactory.create()
    let foundDraft = await Draft.find(draft.id)
    assert.isNotEmpty(foundDraft)
    const response = await client.delete(`/contract/draft/${draft.id}`).loginAs(user)
    const body = response.body()
    assert.isEmpty(body)
    foundDraft = await Draft.find(draft.id)
    assert.isNull(foundDraft)
  })
  test('Successfully delete a draft with attachements', async ({ client, assert }) => {
    const user = await createUser()
    const draft = await DraftFactory.with('attachments', 1).create()
    let foundAttachment = await Attachment.find(draft.attachments[0].id)
    assert.isNotEmpty(foundAttachment)
    const response = await client.delete(`/contract/draft/${draft.id}`).loginAs(user)
    const body = response.body()
    assert.isEmpty(body)
    const foundDraft = await Draft.find(draft.id)
    assert.isNull(foundDraft)
    foundAttachment = await Attachment.find(draft.attachments[0].id)
    assert.isNull(foundAttachment)
  })
  test('Throw a error draftId not found', async ({ client, expect }) => {
    const user = await createUser()
    const response = await client.delete('/contract/draft/3333').loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(404)
    expect(error.text).toBe('NOT_FOUND: Draft not found')
  })
})

const createUser = () => {
  return UserFactory.with('roles', 1, (role) =>
    role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
  ).create()
}
