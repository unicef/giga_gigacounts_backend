import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import UserFactory from 'Database/factories/UserFactory'
import User from 'App/Models/User'

const message =
  'This is a verification message. Please sign it with your wallet to verify ownership \n'

test.group('Generate Random String', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully generate random string and save', async ({ client, expect, assert }) => {
    const user = await UserFactory.with('country', 1)
      .with('roles', 1, (role) => role.with('permissions', 1))
      .create()
    const response = await client.get('/wallet-random-string').loginAs(user)
    const randomString = response.text() as string
    assert.include(randomString, message)
    const foundUser = await User.find(user.id)
    expect(foundUser?.walletRequestString).toBe(randomString)
  })
  test('Successfully generate random string and updates if an user already has a random string', async ({
    client,
    expect,
    assert,
  }) => {
    const user = await UserFactory.with('country', 1)
      .with('roles', 1, (role) => role.with('permissions', 1))
      .create()
    let response = await client.get('/wallet-random-string').loginAs(user)
    let randomString = response.text() as string
    assert.include(randomString, message)
    let foundUser = await User.find(user.id)
    expect(foundUser?.walletRequestString).toBe(randomString)
    response = await client.get('/wallet-random-string').loginAs(user)
    randomString = response.text() as string
    assert.include(randomString, message)
    const updatedUser = await User.find(user.id)
    expect(updatedUser?.walletRequestString).toBe(randomString)
  })
})
