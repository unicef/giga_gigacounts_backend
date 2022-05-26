import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class CreateUsers extends BaseCommand {
  public static commandName = 'create:users'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    const { default: User } = await import('App/Models/User')
    const { default: Country } = await import('App/Models/Country')
    const { default: Role } = await import('App/Models/Role')
    const { roles } = await import('App/Helpers/constants')
    // Countries
    const brazil = await Country.create({
      name: 'Brazil',
      code: 'BR',
      flagUrl:
        'https://sauniconnectweb.blob.core.windows.net/uniconnectweb/images/fc029acd-297a-4fdc-bd2f-05d586f95106.png',
    })
    const botswana = await Country.create({
      name: 'Botswana',
      code: 'BW',
      flagUrl:
        'https://sauniconnectweb.blob.core.windows.net/uniconnectweb/images/a526f447-623a-4d61-a22b-5e959c6fe553.png',
    })
    // Roles
    const countryOffice = await Role.create({ name: roles.countryOffice })
    const government = await Role.create({ name: roles.government })
    const admin = await Role.create({ name: roles.gigaAdmin })
    // Users
    await Promise.all([
      //  Office Brazil 1
      User.create({
        name: 'Brazil Officer 1',
        email: 'officer1_br@giga.com',
        password: '123456',
        countryId: brazil.id,
      }).then((user) => user.related('roles').save(countryOffice)),
      //  Office Brazil 2
      User.create({
        name: 'Brazil Officer 2',
        email: 'officer2_br@giga.com',
        password: '123456',
        countryId: brazil.id,
      }).then((user) => user.related('roles').save(countryOffice)),
      //  Office Botswana
      User.create({
        name: 'Botswana Officer',
        email: 'officer_bw@giga.com',
        password: '123456',
        countryId: botswana.id,
      }).then((user) => user.related('roles').save(countryOffice)),
      //  Government Brazil
      User.create({
        name: 'Brazil Gov',
        email: 'gov_br@giga.com',
        password: '123456',
        countryId: brazil.id,
      }).then((user) => user.related('roles').save(government)),
      //  Government Botswana
      User.create({
        name: 'Botswana Gov',
        email: 'gov_bw@giga.com',
        password: '123456',
        countryId: botswana.id,
      }).then((user) => user.related('roles').save(government)),
      //  Giga Admin 1
      User.create({
        name: 'Giga Admin 1',
        email: 'admin1@giga.com',
        password: '123456',
      }).then((user) => user.related('roles').save(admin)),
      //  Giga Admin 2
      User.create({
        name: 'Giga Admin 2',
        email: 'admin2@giga.com',
        password: '123456',
      }).then((user) => user.related('roles').save(admin)),
    ])
  }
}
