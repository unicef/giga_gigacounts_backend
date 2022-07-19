import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class LoadModels extends BaseCommand {
  public static commandName = 'load:models'

  public static description = 'Fetchs a couple of models from the unicef api to our database'

  public static settings = {
    loadApp: true,
  }

  public async run() {
    const { loadCountries } = await import('App/Helpers/scripts/loadCountries')
    const { loadSchools } = await import('App/Helpers/scripts/loadSchools')
    // await loadCountries()
    await loadSchools()
  }
}
