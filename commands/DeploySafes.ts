import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class DeploySafes extends BaseCommand {
  public static commandName = 'deploy:safes'

  public static description = ''

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    const { main } = await import('App/Helpers/scripts/deploySafes')
    await main()
  }
}
