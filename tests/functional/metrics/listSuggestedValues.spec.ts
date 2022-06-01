import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import MetricFactory from 'Database/factories/MetricFactory'
import UserFactory from 'Database/factories/UserFactory'
import Metric from 'App/Models/Metric'

test.group('List Suggested Metric Values', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return all metrics and its suggested values', async ({
    client,
    expect,
    assert,
  }) => {
    const user = await UserFactory.with('roles', 1, (role) =>
      role.with('permissions', 1, (permission) => permission.merge({ name: 'metric.read' }))
    ).create()
    await MetricFactory.with('suggestedMetrics', 2).createMany(4)
    const response = await client.get('/metric/suggested-values').loginAs(user)
    const metrics = response.body() as Metric[]
    metrics.map((m) => {
      assert.notEmpty(m.name)
      assert.isArray(m.suggestedMetrics)
      expect(m.suggestedMetrics.length).toBe(2)
      assert.notEmpty(m.suggestedMetrics[0].unit)
      assert.notEmpty(m.suggestedMetrics[0].value)
    })
  })
})
