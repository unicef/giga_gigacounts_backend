import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import UserFactory from 'Database/factories/UserFactory'

test.group('Save Draft', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully save a draft', async ({ client, expect, assert }) => {
    const user = await UserFactory.with('roles', 1, (role) => {
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    }).create()
    const response = await client.post('/contract/draft').loginAs(user).json({ name: 'Draft 1' })
    const draft = response.body()
    expect(draft.name).toBe('Draft 1')
    assert.notEmpty(draft.id)
    assert.notEmpty(draft.created_at)
    assert.notEmpty(draft.updated_at)
  })
  test('Throw a validation error if name is missing', async ({ client, expect }) => {
    const user = await UserFactory.with('roles', 1, (role) => {
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    }).create()
    const response = await client.post('/contract/draft').loginAs(user).json({})
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe('required validation failed')
    expect(JSON.parse(error.text).errors[0].field).toBe('name')
    expect(JSON.parse(error.text).errors[0].rule).toBe('required')
  })
  test('Throw a validation error if schools object is wrong', async ({ client, expect }) => {
    const user = await UserFactory.with('roles', 1, (role) => {
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    }).create()
    const response = await client
      .post('/contract/draft')
      .loginAs(user)
      .json({
        name: 'Draft error',
        schools: {
          schools: [{ od: 1 }],
        },
      })
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe('required validation failed')
    expect(JSON.parse(error.text).errors[0].field).toBe('schools.schools.0.id')
    expect(JSON.parse(error.text).errors[0].rule).toBe('required')
  })
  test('Throw a validation error if expected metrics object is wrong', async ({
    client,
    expect,
  }) => {
    const user = await UserFactory.with('roles', 1, (role) => {
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    }).create()
    const response = await client
      .post('/contract/draft')
      .loginAs(user)
      .json({
        name: 'Draft error',
        expectedMetrics: {
          metrics: [{ value: 1, metricOd: 'id' }],
        },
      })
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe('required validation failed')
    expect(JSON.parse(error.text).errors[0].field).toBe('expectedMetrics.metrics.0.metricId')
    expect(JSON.parse(error.text).errors[0].rule).toBe('required')
  })
  test('Throw a error when saving a draft with endDate smaller than startDate', async ({
    client,
    expect,
  }) => {
    const user = await UserFactory.with('roles', 1, (role) => {
      role.with('permissions', 1, (permission) => permission.merge({ name: 'contract.write' }))
    }).create()
    const response = await client.post('/contract/draft').loginAs(user).json({
      name: 'Draft error',
      startDate: '2022-07-06',
      endDate: '2022-07-05',
    })
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe(
      'after or equal to date validation failed'
    )
    expect(JSON.parse(error.text).errors[0].rule).toBe('afterOrEqualToField')
  })
})
