import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import UserFactory from 'Database/factories/UserFactory'

test.group('Profile', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Sucessfully return Country Office user profile', async ({ client, expect, assert }) => {
    const user = await UserFactory.with('country', 1)
      .with('roles', 1, (role) => role.with('permissions', 1))
      .create()
    const response = await client.get('/user/profile').loginAs(user)
    const profile = response.body()
    assert.notEmpty(profile?.name)
    assert.notEmpty(profile?.email)
    assert.notEmpty(profile?.lastName)
    expect(profile?.country.name).toBe('Testland')
    expect(profile?.country.flagUrl).toBe('www.testland.com/flag')
    expect(profile?.country.code).toBe('TTD')
    expect(profile?.role).toBe('Country Office')
  })
  test('Sucessfully return Giga admin user profile', async ({ client, expect, assert }) => {
    const admin = await UserFactory.merge({
      name: 'Admin',
      email: 'admin@giga.com',
    })
      .with('roles', 1, (role) => {
        role.merge({
          name: 'Giga Admin',
        })
      })
      .create()
    const response = await client.get('/user/profile').loginAs(admin)
    const profile = response.body()
    expect(profile?.name).toBe('Admin')
    assert.notEmpty(profile?.lastName)
    expect(profile?.email).toBe('admin@giga.com')
    expect(profile?.role).toBe('Giga Admin')
    assert.notExists(profile?.country)
  })
  test('Sucessfully return Government user profile', async ({ client, expect, assert }) => {
    const user = await UserFactory.with('country', 1)
      .with('roles', 1, (role) => {
        role
          .merge({
            name: 'Government',
          })
          .with('permissions', 1)
      })
      .create()
    const response = await client.get('/user/profile').loginAs(user)
    const profile = response.body()
    assert.notEmpty(profile?.name)
    assert.notEmpty(profile?.lastName)
    assert.notEmpty(profile?.email)
    expect(profile?.country.name).toBe('Testland')
    expect(profile?.country.flagUrl).toBe('www.testland.com/flag')
    expect(profile?.country.code).toBe('TTD')
    expect(profile?.role).toBe('Government')
  })
  test('Sucessfully return ISP user profile', async ({ client, expect, assert }) => {
    const user = await UserFactory.with('roles', 1, (role) => {
      role
        .merge({
          name: 'ISP',
        })
        .with('permissions', 1)
    }).create()
    const response = await client.get('/user/profile').loginAs(user)
    const profile = response.body()
    assert.notEmpty(profile?.name)
    assert.notEmpty(profile?.lastName)
    assert.notEmpty(profile?.email)
    assert.notExists(profile?.country)
    expect(profile?.role).toBe('ISP')
  })
  test('Throw a UnAuthorized error if user is not authenticated', async ({ client, expect }) => {
    const response = await client.get('/user/profile')
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(401)
    expect(JSON.parse(error.text).errors[0].message).toBe(
      'E_UNAUTHORIZED_ACCESS: Unauthorized access'
    )
  })
})
