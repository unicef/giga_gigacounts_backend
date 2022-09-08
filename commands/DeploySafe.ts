import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class DeploySafe extends BaseCommand {
  public static commandName = 'deploy:safe'

  public static description = ''

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    const deploySafe = await import('App/Helpers/scripts/deploySafe')
    await deploySafe.execute(process.env.NAME || '')
  }
}
