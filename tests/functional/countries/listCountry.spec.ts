import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import CountryFactory from 'Database/factories/CountryFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('List Countries', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return all the countries', async ({ client, expect, assert }) => {
    await CountryFactory.apply('random').createMany(10)
    const user = await UserFactory.with('country', 1).with('roles', 1).create()
    const response = await client.get('/api/country').loginAs(user)
    const countries = response.body()
    expect(countries.length).toBe(11)
    countries.map((c) => {
      assert.notEmpty(c.id)
      assert.notEmpty(c.name)
      assert.notEmpty(c.code)
      assert.notEmpty(c.flag_url)
    })
  })
})
