import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import FrequencyFactory from 'Database/factories/FrequencyFactory'
import UserFactory from 'Database/factories/UserFactory'
import Frequency from 'App/Models/Frequency'

test.group('List Frequencies', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return all payment frequencies', async ({ client, expect }) => {
    await FrequencyFactory.merge([
      {
        name: 'Daily',
      },
      {
        name: 'Weekly',
      },
      {
        name: 'Yearly',
      },
      {
        name: 'Monthly',
      },
    ]).createMany(4)
    const user = await UserFactory.with('roles', 1).create()
    const response = await client.get('/payment/frequencies').loginAs(user)
    const frequencies = response.body() as Frequency[]
    expect(frequencies.length).toBe(4)
    expect(frequencies.some((f) => f.name === 'Daily')).toBeTruthy()
    expect(frequencies.some((f) => f.name === 'Weekly')).toBeTruthy()
    expect(frequencies.some((f) => f.name === 'Yearly')).toBeTruthy()
    expect(frequencies.some((f) => f.name === 'Monthly')).toBeTruthy()
  })
})
