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
    const user = await UserFactory.with('country', 1)
      .with('roles', 1, (role) => {
        role.merge({
          name: 'Giga Admin',
        })
      })
      .create()
    const response = await client.get('/country').loginAs(user)
    const countries = response.body()
    expect(countries.length).toBe(11)
    countries.map((c) => {
      assert.notEmpty(c.id)
      assert.notEmpty(c.name)
      assert.notEmpty(c.code)
      assert.notEmpty(c.flag_url)
    })
  })
  test('Succesfully only return the country of the user if is a Government role', async ({
    client,
    expect,
  }) => {
    await CountryFactory.apply('random').createMany(10)
    const user = await UserFactory.with('country', 1, (country) => {
      country.merge({ name: 'Brazil' })
    })
      .with('roles', 1, (role) => {
        role.merge({
          name: 'Government',
        })
      })
      .create()
    const response = await client.get('/country').loginAs(user)
    const countries = response.body()
    expect(countries.length).toBe(1)
    expect(countries[0].name).toBe('Brazil')
  })
  test('Succesfully only return the country of the user if is a Country Office role', async ({
    client,
    expect,
  }) => {
    await CountryFactory.apply('random').createMany(10)
    const user = await UserFactory.with('country', 1, (country) => {
      country.merge({ name: 'Argentina' })
    })
      .with('roles', 1)
      .create()
    const response = await client.get('/country').loginAs(user)
    const countries = response.body()
    expect(countries.length).toBe(1)
    expect(countries[0].name).toBe('Argentina')
  })
  test('Successfully return all countries alphabetically', async ({ client, expect, assert }) => {
    await CountryFactory.merge([
      {
        name: 'C',
      },
      {
        name: 'D',
      },
      {
        name: 'B',
      },
      {
        name: 'A',
      },
    ]).createMany(4)
    const user = await UserFactory.with('roles', 1, (role) => {
      role.merge({
        name: 'Giga Admin',
      })
    }).create()
    const response = await client.get('/country').loginAs(user)
    const countries = response.body()
    expect(countries.length).toBe(4)
    countries.map((c) => {
      assert.notEmpty(c.id)
      assert.notEmpty(c.name)
      assert.notEmpty(c.code)
      assert.notEmpty(c.flag_url)
    })
    expect(countries[0].name).toBe('A')
    expect(countries[1].name).toBe('B')
    expect(countries[2].name).toBe('C')
    expect(countries[3].name).toBe('D')
  })
})
