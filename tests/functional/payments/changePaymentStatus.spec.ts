import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import PaymentFactory from 'Database/factories/PaymentFactory'
import UserFactory from 'Database/factories/UserFactory'
import CurrencyFactory from 'Database/factories/CurrencyFactory'
import Payment from 'App/Models/Payment'
import { PaymentStatus } from 'App/Helpers/constants'

test.group('Change Payment Status', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully change a pending payment to verified', async ({ client, expect }) => {
    const user = await setupUser()
    const currency = await CurrencyFactory.create()
    const payment = await PaymentFactory.merge({
      createdBy: user.id,
      status: 0,
      currencyId: currency.id,
    })
      .with('contract', 1, (contract) => {
        contract
          .merge({ createdBy: user.id, countryId: user.countryId, currencyId: currency.id })
          .with('frequency')
          .with('isp')
      })
      .create()
    const response = await client
      .post('/payment/change-status')
      .loginAs(user)
      .json({ paymentId: payment.id, status: 2 })
    const paymentRes = response.body()
    expect(paymentRes.status).toBe(PaymentStatus[2])
    expect(paymentRes.id).toBe(payment.id)
  })
  test('Successfully change a pending payment to rejected', async ({ client, expect }) => {
    const user = await setupUser()
    const currency = await CurrencyFactory.create()
    const payment = await PaymentFactory.merge({
      createdBy: user.id,
      status: 0,
      currencyId: currency.id,
    })
      .with('contract', 1, (contract) => {
        contract
          .merge({ createdBy: user.id, countryId: user.countryId, currencyId: currency.id })
          .with('frequency')
          .with('isp')
      })
      .create()
    const response = await client
      .post('/payment/change-status')
      .loginAs(user)
      .json({ paymentId: payment.id, status: 1 })
    const paymentRes = response.body()
    expect(paymentRes.status).toBe(PaymentStatus[1])
    expect(paymentRes.id).toBe(payment.id)
  })
  test('Successfully change a rejected payment to pending', async ({ client, expect }) => {
    const user = await setupUser()
    const currency = await CurrencyFactory.create()
    const payment = await PaymentFactory.merge({
      createdBy: user.id,
      status: 1,
      currencyId: currency.id,
    })
      .with('contract', 1, (contract) => {
        contract
          .merge({ createdBy: user.id, countryId: user.countryId, currencyId: currency.id })
          .with('frequency')
          .with('isp')
      })
      .create()
    const response = await client
      .post('/payment/change-status')
      .loginAs(user)
      .json({ paymentId: payment.id, status: 0 })
    const paymentRes = response.body()
    expect(paymentRes.status).toBe(PaymentStatus[0])
    expect(paymentRes.id).toBe(payment.id)
  })
  test('Throw an error when trying to change a rejected payment to verified', async ({
    client,
    expect,
  }) => {
    const user = await setupUser()
    const currency = await CurrencyFactory.create()
    const payment = await PaymentFactory.merge({
      createdBy: user.id,
      status: 1,
      currencyId: currency.id,
    })
      .with('contract', 1, (contract) => {
        contract
          .merge({ createdBy: user.id, countryId: user.countryId, currencyId: currency.id })
          .with('frequency')
          .with('isp')
      })
      .create()
    const response = await client
      .post('/payment/change-status')
      .loginAs(user)
      .json({ paymentId: payment.id, status: 2 })
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(400)
    expect(error.text).toBe('INVALID_STATUS: Rejected payment cant be verified')
    const fetchedPayment = await Payment.find(payment.id)
    expect(fetchedPayment?.status).toBe(1)
  })
  test('Throw an error when trying to change a verified payment status', async ({
    client,
    expect,
  }) => {
    const user = await setupUser()
    const currency = await CurrencyFactory.create()
    const payment = await PaymentFactory.merge({
      createdBy: user.id,
      status: 2,
      currencyId: currency.id,
    })
      .with('contract', 1, (contract) => {
        contract
          .merge({ createdBy: user.id, countryId: user.countryId, currencyId: currency.id })
          .with('frequency')
          .with('isp')
      })
      .create()
    const response = await client
      .post('/payment/change-status')
      .loginAs(user)
      .json({ paymentId: payment.id, status: 1 })
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(400)
    expect(error.text).toBe('INVALID_STATUS: Payment already verified')
    const fetchedPayment = await Payment.find(payment.id)
    expect(fetchedPayment?.status).toBe(2)
  })
  test('Throw an error when payment is not found', async ({ client, expect }) => {
    const user = await setupUser()
    const response = await client
      .post('/payment/change-status')
      .loginAs(user)
      .json({ paymentId: '333', status: 1 })
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(404)
    expect(error.text).toBe('NOT_FOUND: Payment not found')
  })
  test('Throw an error when sending a wrong status', async ({ client, expect }) => {
    const user = await setupUser()
    const currency = await CurrencyFactory.create()
    const payment = await PaymentFactory.merge({
      createdBy: user.id,
      status: 0,
      currencyId: currency.id,
    })
      .with('contract', 1, (contract) => {
        contract
          .merge({ createdBy: user.id, countryId: user.countryId, currencyId: currency.id })
          .with('frequency')
          .with('isp')
      })
      .create()
    const response = await client
      .post('/payment/change-status')
      .loginAs(user)
      .json({ paymentId: payment.id, status: 3 })
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe(
      'Invalid status, available status are: 0, 1, 2'
    )
  })
})

const setupUser = async () => {
  return UserFactory.with('roles', 1, (role) =>
    role
      .merge({ name: 'Giga Admin' })
      .with('permissions', 1, (permission) => permission.merge({ name: 'payment.write' }))
  )
    .with('country')
    .create()
}
