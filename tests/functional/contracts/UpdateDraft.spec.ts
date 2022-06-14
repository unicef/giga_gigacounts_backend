import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import UserFactory from 'Database/factories/UserFactory'
import DraftFactory from 'Database/factories/DraftFactory'

test.group('Save Draft', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully update a draft', async ({ client, expect, assert }) => {
    const draft = await DraftFactory.create()
    const user = await createUser()
    console.log(draft)
    // const response = await client.put('/contract/draft').loginAs(user).json({

    // })
  })
  test('Throw an error when a draft doesnt exist', async ({ client, expect, assert }) => {})
  test('Throw a validation error if name is missing', async ({ client, expect, assert }) => {})
  test('Throw a validation error if attachment object is wrong', async ({ client, expect }) => {})
  test('Throw a validation error if schools object is wrong', async ({ client, expect }) => {})
  test('Throw a validation error if expected metrics object is wrong', async ({
    client,
    expect,
  }) => {})
})

const createUser = () => {
  return UserFactory.with('roles', 1, (role) => {
    role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
  }).create()
}
