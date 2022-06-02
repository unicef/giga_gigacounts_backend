import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import IspFactory from 'Database/factories/IspFactory'
import UserFactory from 'Database/factories/UserFactory'
import Isp from 'App/Models/Isp'

test.group('List ISPs', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return all ISPs', async ({ client, expect }) => {
    await IspFactory.merge([
      {
        name: 'T-Mobile',
      },
      {
        name: 'Verizon',
      },
      {
        name: 'AT&T',
      },
    ]).createMany(3)
    const user = await UserFactory.with('country', 1)
      .with('roles', 1, (role) =>
        role.with('permissions', 1, (permission) => permission.merge({ name: 'isp.read' }))
      )
      .create()
    const response = await client.get('/api/isp').loginAs(user)
    const isps = response.body() as Isp[]
    expect(isps.length).toBe(3)
    expect(isps.some((i) => i.name === 'T-Mobile')).toBeTruthy()
    expect(isps.some((i) => i.name === 'Verizon')).toBeTruthy()
    expect(isps.some((i) => i.name === 'AT&T')).toBeTruthy()
  })
})
