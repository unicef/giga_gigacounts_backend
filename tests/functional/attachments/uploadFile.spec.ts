import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import UserFactory from 'Database/factories/UserFactory'

import testUtils from '../../utils'
import Attachment from 'App/Models/Attachment'

const lower20Pdf = `${__dirname}/lower_20.pdf`
const imageJpg = `${__dirname}/image.jpg`
const imagePng = `${__dirname}/image.png`

test.group('Upload file attachments', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Return an error when the file passed exceeds 20mb limit', async ({ expect, client }) => {
    const bigger20Pdf = 'data:application/pdf;base64,' + Buffer.allocUnsafe(20 * 1024 * 1025)
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const response = await client
      .post('/attachments/upload')
      .loginAs(user)
      .json({ file: bigger20Pdf })
    const error = response.error() as import('superagent').HTTPError
    console.log(error)
    expect(error.status).toBe(413)
    expect(JSON.parse(error.text).message).toBe(
      'E_REQUEST_ENTITY_TOO_LARGE: request entity too large'
    )
  })
  test('Successfully upload a pdf file', async ({ client, assert }) => {
    const file = await testUtils.toBase64('data:application/pdf;base64,', lower20Pdf)
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const response = await client.post('/attachments/upload').loginAs(user).json({ file })
    const attachment = response.body() as Attachment
    assert.include(
      attachment.url,
      'https://unicefgigastoragedev.blob.core.windows.net/attachments-dev/'
    )
    assert.include(attachment.url, '.pdf')
    assert.isNotEmpty(attachment.id)
  })
  test('Successfully upload a png file', async ({ assert, client }) => {
    const file = await testUtils.toBase64('data:image/png;base64,', imagePng)
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const response = await client.post('/attachments/upload').loginAs(user).json({ file })
    const attachment = response.body() as Attachment
    assert.include(
      attachment.url,
      'https://unicefgigastoragedev.blob.core.windows.net/attachments-dev/'
    )
    assert.include(attachment.url, '.png')
    assert.isNotEmpty(attachment.id)
  })
  test('Successfully upload a jpg file', async ({ assert, client }) => {
    const file = await testUtils.toBase64('data:image/jpg;base64,', imageJpg)
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const response = await client.post('/attachments/upload').loginAs(user).json({ file })
    const attachment = response.body() as Attachment
    assert.include(
      attachment.url,
      'https://unicefgigastoragedev.blob.core.windows.net/attachments-dev/'
    )
    assert.include(attachment.url, '.jpg')
    assert.isNotEmpty(attachment.id)
  })
})
