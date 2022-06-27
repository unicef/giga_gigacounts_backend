import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ApiClient } from '@japa/api-client'

import UserFactory from 'Database/factories/UserFactory'
import DraftFactory from 'Database/factories/DraftFactory'

import testUtils from '../../utils'

import Attachment from 'App/Models/Attachment'
import User from 'App/Models/User'
import Draft from 'App/Models/Draft'
import ContractFactory from 'Database/factories/ContractFactory'
import Contract from 'App/Models/Contract'
import PaymentFactory from 'Database/factories/PaymentFactory'
import Payment from 'App/Models/Payment'

const imagePng = `${__dirname}/image.png`

test.group('Upload file attachments', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully delete a attachment related to an draft', async ({
    client,
    assert,
    expect,
  }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const draft = await DraftFactory.create()
    const attachment = await createAttachment(client, user, 'draft', draft.id)
    let foundDraft = await Draft.find(draft.id)
    await foundDraft?.load('attachments')
    expect(foundDraft?.attachments.length).toBe(1)
    const response = await client
      .delete(`/attachments/${attachment.id}/draft/${draft.id}`)
      .loginAs(user)
    const body = response.body() as Attachment
    assert.isEmpty(body)
    const attachmentFound = await Attachment.find(attachment.id)
    assert.isNull(attachmentFound)
    foundDraft = await Draft.find(draft.id)
    await foundDraft?.load('attachments')
    assert.isEmpty(foundDraft?.attachments)
  })
  test('Successfully delete a attachment related to an contract', async ({
    client,
    assert,
    expect,
  }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const contract = await ContractFactory.with('country')
      .with('currency')
      .with('frequency')
      .with('isp')
      .merge({
        createdBy: user.id,
      })
      .create()
    const attachment = await createAttachment(client, user, 'contract', contract.id)
    let foundContract = await Contract.find(contract.id)
    await foundContract?.load('attachments')
    expect(foundContract?.attachments.length).toBe(1)
    const response = await client
      .delete(`/attachments/${attachment.id}/contract/${contract.id}`)
      .loginAs(user)
    const body = response.body() as Attachment
    assert.isEmpty(body)
    const attachmentFound = await Attachment.find(attachment.id)
    assert.isNull(attachmentFound)
    foundContract = await Contract.find(contract.id)
    await foundContract?.load('attachments')
    assert.isEmpty(foundContract?.attachments)
  })
  test('Successfully delete a attachment related to an payment receipt', async ({
    client,
    assert,
    expect,
  }) => {
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
    const attachment = await createAttachment(client, user, 'receipt', payment.id)
    let foundPayment = await Payment.find(payment.id)
    expect(foundPayment?.receiptId).toBe(attachment.id)
    const response = await client
      .delete(`/attachments/${attachment.id}/receipt/${payment.id}`)
      .loginAs(user)
    const body = response.body() as Attachment
    assert.isEmpty(body)
    const attachmentFound = await Attachment.find(attachment.id)
    assert.isNull(attachmentFound)
    foundPayment = await Payment.find(payment.id)
    assert.isNull(foundPayment?.receiptId)
  })
  test('Successfully delete a attachment related to an payment invoice', async ({
    client,
    assert,
    expect,
  }) => {
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
    const attachment = await createAttachment(client, user, 'invoice', payment.id)
    let foundPayment = await Payment.find(payment.id)
    expect(foundPayment?.invoiceId).toBe(attachment.id)
    const response = await client
      .delete(`/attachments/${attachment.id}/invoice/${payment.id}`)
      .loginAs(user)
    const body = response.body() as Attachment
    assert.isEmpty(body)
    const attachmentFound = await Attachment.find(attachment.id)
    assert.isNull(attachmentFound)
    foundPayment = await Payment.find(payment.id)
    assert.isNull(foundPayment?.invoiceId)
  })
  test('Throw an error if tries to delete a attachment that doesnt exist', async ({
    client,
    expect,
  }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'attachment.write' }))
    ).create()
    const response = await client.delete(`/attachments/3333/contract/3333`).loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(404)
    expect(error.text).toBe('NOT_FOUND: Attachment not found')
  })
})

const createAttachment = async (client: ApiClient, user: User, type: string, typeId: number) => {
  const file = await testUtils.toBase64('data:image/png;base64,', imagePng)
  const response = await client
    .post('/attachments/upload')
    .loginAs(user)
    .json({ file, type, typeId, name: 'fake name' })
  const attachment = response.body() as Attachment
  return attachment
}
