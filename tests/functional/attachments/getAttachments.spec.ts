import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import UserFactory from 'Database/factories/UserFactory'
import AttachmentFactory from 'Database/factories/AttachmentFactory'

import Attachment from 'App/Models/Attachment'

test.group('Get Attachment', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return a attachment by id', async ({ client, assert }) => {
    const attachment = await AttachmentFactory.create()
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.read' }))
    ).create()
    const response = await client.get(`/attachments/${attachment.id}`).loginAs(user)
    const body = response.body() as Attachment
    assert.exists(body.id)
    assert.exists(body.url)
  })
  test('Throw an error if a attachment doesnt exist', async ({ client, expect }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.read' }))
    ).create()
    const response = await client.get(`/attachments/3333`).loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(404)
    expect(error.text).toBe('NOT_FOUND: Attachment not found')
  })
})
