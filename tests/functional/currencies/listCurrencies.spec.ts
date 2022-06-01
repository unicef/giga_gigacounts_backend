import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import CurrencyFactory from 'Database/factories/CurrencyFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('List Currencies', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return all the countries', async ({ client, expect, assert }) => {
    await CurrencyFactory.apply('random').createMany(5)
    const user = await UserFactory.with('country', 1).with('roles', 1).create()
    const response = await client.get('/currency').loginAs(user)
    const currencies = response.body()
    expect(currencies.length).toBe(5)
    currencies.map((c) => {
      assert.notEmpty(c.id)
      assert.notEmpty(c.name)
    })
  })
})
