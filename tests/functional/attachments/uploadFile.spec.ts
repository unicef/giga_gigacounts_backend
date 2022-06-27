import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import UserFactory from 'Database/factories/UserFactory'
import DraftFactory from 'Database/factories/DraftFactory'
import PaymentFactory from 'Database/factories/PaymentFactory'

import testUtils from '../../utils'
import Attachment from 'App/Models/Attachment'
import Draft from 'App/Models/Draft'
import Payment from 'App/Models/Payment'

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
      .json({ file: bigger20Pdf, type: 'receipt', typeId: 1 })
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(413)
    expect(JSON.parse(error.text).message).toBe(
      'E_REQUEST_ENTITY_TOO_LARGE: request entity too large'
    )
  })
  test('Successfully upload a pdf file to an draft', async ({ client, assert, expect }) => {
    const draft = await DraftFactory.create()
    const file = await testUtils.toBase64('data:application/pdf;base64,', lower20Pdf)
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const response = await client
      .post('/attachments/upload')
      .loginAs(user)
      .json({ file, type: 'draft', typeId: draft.id })
    const attachment = response.body() as Attachment
    assert.include(
      attachment.url,
      'https://unicefgigastoragedev.blob.core.windows.net/attachments-dev/'
    )
    const foundDraft = await Draft.find(draft.id)
    await foundDraft?.load('attachments')
    assert.include(attachment.url, '.pdf')
    assert.isNotEmpty(attachment.id)
    expect(attachment.url).toBe(foundDraft?.attachments[0].url)
  })
  test('Successfully upload a png file as an invoice', async ({ assert, client, expect }) => {
    const file = await testUtils.toBase64('data:image/png;base64,', imagePng)
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const payment = await PaymentFactory.merge({ amount: 100 })
      .with('contract', 1, (ctc) => {
        ctc.with('country').with('currency').with('frequency').with('isp').merge({
          createdBy: user.id,
        })
      })
      .create()
    const response = await client
      .post('/attachments/upload')
      .loginAs(user)
      .json({ file, type: 'invoice', typeId: payment.id })
    const attachment = response.body() as Attachment
    assert.include(
      attachment.url,
      'https://unicefgigastoragedev.blob.core.windows.net/attachments-dev/'
    )
    assert.include(attachment.url, '.png')
    assert.isNotEmpty(attachment.id)
    const foundPayment = await Payment.find(payment.id)
    expect(attachment.id).toBe(foundPayment?.invoiceId)
  })
  test('Successfully upload a jpg file as a receipt', async ({ assert, client, expect }) => {
    const file = await testUtils.toBase64('data:image/jpg;base64,', imageJpg)
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const payment = await PaymentFactory.merge({ amount: 100 })
      .with('contract', 1, (ctc) => {
        ctc.with('country').with('currency').with('frequency').with('isp').merge({
          createdBy: user.id,
        })
      })
      .create()
    const response = await client
      .post('/attachments/upload')
      .loginAs(user)
      .json({ file, type: 'receipt', typeId: payment.id })
    const attachment = response.body() as Attachment
    assert.include(
      attachment.url,
      'https://unicefgigastoragedev.blob.core.windows.net/attachments-dev/'
    )
    assert.include(attachment.url, '.jpg')
    assert.isNotEmpty(attachment.id)
    const foundPayment = await Payment.find(payment.id)
    expect(attachment.id).toBe(foundPayment?.receiptId)
  })
})
