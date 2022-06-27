import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import UserFactory from 'Database/factories/UserFactory'
import CountryFactory from 'Database/factories/CountryFactory'
import SchoolFactory from 'Database/factories/SchoolFactory'

test.group('List Schools', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return all schools', async ({ client, expect, assert }) => {
    const [country1, country2] = await setupCountries()
    await setupSchools(country1.id, country2.id)
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'school.read' }))
    ).create()
    let response = await client.get('/school').loginAs(user)
    const schools = response.body() as any[]
    expect(schools.length).toBe(6)
    schools.map((s) => {
      assert.notEmpty(s.id)
      assert.notEmpty(s.name)
    })
  })
  test('Successfully return all schools from a certain country', async ({
    client,
    expect,
    assert,
  }) => {
    const [country1, country2] = await setupCountries()
    await setupSchools(country1.id, country2.id)
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'school.read' }))
    ).create()
    let response = await client.get(`/school?countryId=${country1.id}`).loginAs(user)
    const schools = response.body() as any[]
    expect(schools.length).toBe(4)
    schools.map((s) => {
      assert.notEmpty(s.id)
      assert.notEmpty(s.name)
      expect(s.country_id).toBe(country1.id)
    })
    response = await client.get(`/school?countryId=${country2.id}`).loginAs(user)
    const schools2 = response.body() as any[]
    expect(schools2.length).toBe(2)
    schools2.map((s) => {
      assert.notEmpty(s.id)
      assert.notEmpty(s.name)
      expect(s.country_id).toBe(country2.id)
    })
  })
})

const setupCountries = async () => {
  const country1 = await CountryFactory.create()
  const country2 = await CountryFactory.merge({ name: 'Country 2' }).create()
  return [country1, country2]
}

const setupSchools = async (countryId: number, otherCountry: number) => {
  await SchoolFactory.merge([
    {
      countryId: countryId,
    },
    {
      countryId: countryId,
    },
    {
      countryId: countryId,
    },
    {
      countryId: otherCountry,
    },
    {
      countryId: otherCountry,
    },
    {
      countryId: countryId,
    },
  ]).createMany(6)
}
