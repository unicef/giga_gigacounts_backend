import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import CurrencyFactory from 'Database/factories/CurrencyFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('List Currencies', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return all the currencies', async ({ client, expect, assert }) => {
    await createFiatCurrencies()
    await createCryptoCurrencies()
    const user = await UserFactory.with('country', 1).with('roles', 1).create()
    const response = await client.get('/currency').loginAs(user)
    const currencies = response.body()
    expect(currencies.length).toBe(8)
    currencies.map((c) => {
      assert.notEmpty(c.id)
      assert.notEmpty(c.name)
      assert.exists(c.type)
      assert.notEmpty(c.code)
    })
  })
  test('Successfully return all Fiat currencies', async ({ client, expect, assert }) => {
    await createFiatCurrencies()
    await createCryptoCurrencies()
    const user = await UserFactory.with('country', 1).with('roles', 1).create()
    const response = await client.get('/currency?type=fiat').loginAs(user)
    const currencies = response.body()
    expect(currencies.length).toBe(5)
    currencies.map((c) => {
      assert.notEmpty(c.id)
      assert.notEmpty(c.name)
      expect(c.type).toBe(0)
      assert.notEmpty(c.code)
    })
  })
  test('Successfully return all Crypto currencies', async ({ client, expect, assert }) => {
    await createFiatCurrencies()
    await createCryptoCurrencies()
    const user = await UserFactory.with('country', 1).with('roles', 1).create()
    const response = await client.get('/currency?type=crypto').loginAs(user)
    const currencies = response.body()
    expect(currencies.length).toBe(3)
    currencies.map((c) => {
      assert.notEmpty(c.id)
      assert.notEmpty(c.name)
      expect(c.type).toBe(1)
      assert.notEmpty(c.code)
    })
  })
  test('Successfully return empty if a currency type is not found', async ({ client, expect }) => {
    await createFiatCurrencies()
    await createCryptoCurrencies()
    const user = await UserFactory.with('country', 1).with('roles', 1).create()
    const response = await client.get('/currency?type=fake').loginAs(user)
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(400)
    expect(error.text).toBe('INVALID_TYPE: Invalid currency type')
  })
})

const createFiatCurrencies = () => {
  return CurrencyFactory.apply('random').createMany(5)
}

const createCryptoCurrencies = () => {
  return CurrencyFactory.merge([
    {
      name: 'Ether',
      code: 'ETH',
      type: 1,
    },
    {
      name: 'Cardano',
      code: 'ADA',
      type: 1,
    },
    {
      name: 'Bitcoin',
      code: 'BTC',
      type: 1,
    },
  ]).createMany(3)
}
