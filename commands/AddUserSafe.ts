import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class AddUserSafe extends BaseCommand {
  public static commandName = 'add:user_safe'

  public static description = ''

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    const { execute } = await import('App/Helpers/scripts/addUsersToSafe')
    await execute()
  }
}
