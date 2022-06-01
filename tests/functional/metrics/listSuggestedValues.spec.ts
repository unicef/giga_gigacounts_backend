import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import MetricFactory from 'Database/factories/MetricFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('List Suggested Metric Values', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return all metrics and its suggested values', async ({ client, expect }) => {
    const user = await UserFactory.with('roles', 1).create()
    // await MetricFactory.with('suggestedValues', 2).createMany(4)
    const metric = await MetricFactory.with('suggestedMetrics', 1).create()
    console.log(metric)
    const response = await client.get('/metric/suggested-values').loginAs(user)
    // console.log(response.body())
  })
})

// const setupMetrics = async () => {}
