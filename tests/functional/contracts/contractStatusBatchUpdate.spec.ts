import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Contract Status Batch Update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
})

/**
 * 2 Status confirmed to ongoing
 * 1 Stauts Confirmed para não mudar
 * 2 Status ongoing to expired
 * 1 sttus ongoing para não mudar
 */
