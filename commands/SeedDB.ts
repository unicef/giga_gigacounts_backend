import { BaseCommand } from '@adonisjs/core/build/standalone'

const NODE_ENV = process.env.NODE_ENV || ''

export default class CreateUsers extends BaseCommand {
  public static commandName = 'seed:db'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    const { default: Country } = await import('App/Models/Country')
    const { createMetrics } = await import('App/Helpers/scripts/metrics')
    const { createFrequencies } = await import('App/Helpers/scripts/frequencies')
    const { createCurrencies } = await import('App/Helpers/scripts/currencies')
    const { createPermissions } = await import('App/Helpers/scripts/permissions')
    const { createRoles } = await import('App/Helpers/scripts/roles')
    const { createUser } = await import('App/Helpers/scripts/users')
    const { loadCountries } = await import('App/Helpers/scripts/loadCountries')
    const { loadSchools } = await import('App/Helpers/scripts/loadSchools')
    const { createContracts, createLtas, createIsps } = await import(
      'App/Helpers/scripts/contractSchools'
    )
    const metrics = await createMetrics()
    const frequencies = await createFrequencies()
    const currencies = await createCurrencies()
    await loadCountries()
    const permissions = await createPermissions()
    const roles = await createRoles(permissions)
    const brazil = await Country.findBy('name', 'Brazil')
    const botswana = await Country.findBy('name', 'Botswana')
    const users = await createUser(brazil?.id || 1, botswana?.id || 2, roles)
    const isps = await createIsps(brazil?.id || 1, botswana?.id || 2)
    const ltas = await createLtas(brazil?.id || 1, botswana?.id || 2)
    if (NODE_ENV !== 'uat') {
      return createContracts(
        ltas,
        isps,
        brazil?.id || 1,
        botswana?.id || 2,
        currencies[0].id,
        frequencies[0].id,
        '1000000',
        users[0].id,
        metrics
      )
    }
    await loadSchools()
  }
}
