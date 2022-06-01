import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import UserFactory from 'Database/factories/UserFactory'

test.group('ACL Middleware', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully allow a user with the proper permission to access a route', async ({
    client,
    expect,
  }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'test1.read' }))
    ).create()
    const response = await client.get('/test/one-permission').loginAs(user)
    const body = response.body()
    expect(body.message).toBe('Authorized!')
  })
  test('Return a unauthorized error when a user doesnt have the proper permission', async ({
    client,
    expect,
  }) => {
    const user = await UserFactory.with('roles', 1).create()
    const response = await client.get('/test/one-permission').loginAs(user)
    const body = response.body()
    expect(body.message).toBe('Unauthorized')
  })
  test('Successfully allow a user with both permissions needed to access a route', async ({
    client,
    expect,
  }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 2, (permission) =>
        permission.merge([
          {
            name: 'test2.read',
          },
          {
            name: 'test1.read',
          },
        ])
      )
    ).create()
    const response = await client.get('/test/two-permission').loginAs(user)
    const body = response.body()
    expect(body.message).toBe('Authorized!')
  })
  test('Return a unauthorized error when a user only have one out of many permissions to access a route', async ({
    client,
    expect,
  }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) =>
        permission.merge([
          {
            name: 'test2.read',
          },
        ])
      )
    ).create()
    const response = await client.get('/test/two-permission').loginAs(user)
    const body = response.body()
    expect(body.message).toBe('Unauthorized')
  })
})
