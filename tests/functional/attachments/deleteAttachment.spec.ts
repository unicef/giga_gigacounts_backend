import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import UserFactory from 'Database/factories/UserFactory'
import AttachmentFactory from 'Database/factories/AttachmentFactory'

import Attachment from 'App/Models/Attachment'

test.group('Upload file attachments', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully delete a attachment', async ({ client, assert }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const attachment = await AttachmentFactory.create()
    const response = await client.delete(`/attachments/${attachment.id}`).loginAs(user)
    const body = response.body() as Attachment
    assert.isEmpty(body)
    const attachmentFound = await Attachment.find(attachment.id)
    assert.isNull(attachmentFound)
  })
  test('Successfully delete a attachment related to an contract', async ({ client, assert }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const attachment = await AttachmentFactory.with('contracts', 1, (contract) => {
      contract.with('country').with('currency').with('frequency').with('isp').merge({
        createdBy: user.id,
      })
    }).create()
    const response = await client.delete(`/attachments/${attachment.id}`).loginAs(user)
    const body = response.body() as Attachment
    assert.isEmpty(body)
    const attachmentFound = await Attachment.find(attachment.id)
    assert.isNull(attachmentFound)
  })
  test('Throw an error if tries to delete a attachment that doesnt exist', async ({
    client,
    expect,
  }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const response = await client.delete(`/attachments/3333`).loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(404)
    expect(error.text).toBe('NOT_FOUND: Attachment not found')
  })
})
