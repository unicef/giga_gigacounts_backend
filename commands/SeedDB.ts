import { BaseCommand } from '@adonisjs/core/build/standalone'
import { DateTime } from 'luxon'

export default class CreateUsers extends BaseCommand {
  public static commandName = 'seed:db'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    const { default: User } = await import('App/Models/User')
    const { default: Country } = await import('App/Models/Country')
    const { default: Role } = await import('App/Models/Role')
    const { default: Permission } = await import('App/Models/Permission')
    const { default: Frequency } = await import('App/Models/Frequency')
    const { default: Currency } = await import('App/Models/Currency')
    const { default: School } = await import('App/Models/School')
    const { default: Contract } = await import('App/Models/Contract')
    const { default: Metric } = await import('App/Models/Metric')
    const { default: Draft } = await import('App/Models/Draft')
    const { default: SuggestedMetric } = await import('App/Models/SuggestedMetric')
    const { roles, permissions, ContractStatus } = await import('App/Helpers/constants')
    const { createContracts, createLtas, createIsps } = await import('App/Helpers/contractSchools')
    // Metrics
    const uptime = await Metric.firstOrCreate({ name: 'Uptime', weight: 35 })
    const latency = await Metric.firstOrCreate({ name: 'Latency', weight: 15 })
    const download = await Metric.firstOrCreate({ name: 'Download speed', weight: 30 })
    const upload = await Metric.firstOrCreate({ name: 'Upload speed', weight: 20 })
    // Suggested values
    await SuggestedMetric.firstOrCreate({ metricId: uptime.id, value: '100', unit: '%' })
    await SuggestedMetric.firstOrCreate({ metricId: uptime.id, value: '98', unit: '%' })
    await SuggestedMetric.firstOrCreate({ metricId: uptime.id, value: '96', unit: '%' })
    await SuggestedMetric.firstOrCreate({ metricId: uptime.id, value: '94', unit: '%' })

    await SuggestedMetric.firstOrCreate({ metricId: latency.id, value: '300', unit: 'ms' })
    await SuggestedMetric.firstOrCreate({ metricId: latency.id, value: '200', unit: 'ms' })
    await SuggestedMetric.firstOrCreate({ metricId: latency.id, value: '100', unit: 'ms' })
    await SuggestedMetric.firstOrCreate({ metricId: latency.id, value: '50', unit: 'ms' })

    await SuggestedMetric.firstOrCreate({ metricId: download.id, value: '50', unit: 'Mb/s' })
    await SuggestedMetric.firstOrCreate({ metricId: download.id, value: '30', unit: 'Mb/s' })
    await SuggestedMetric.firstOrCreate({ metricId: download.id, value: '20', unit: 'Mb/s' })

    await SuggestedMetric.firstOrCreate({ metricId: upload.id, value: '30', unit: 'Mb/s' })
    await SuggestedMetric.firstOrCreate({ metricId: upload.id, value: '20', unit: 'Mb/s' })
    await SuggestedMetric.firstOrCreate({ metricId: upload.id, value: '10', unit: 'Mb/s' })
    // Frequency
    const frequency = await Frequency.firstOrCreate({ name: 'Monthly' })
    await Frequency.firstOrCreate({ name: 'Daily' })
    // Currencies
    const brl = await Currency.firstOrCreate({ name: 'Brazilian Real' })
    const usd = await Currency.firstOrCreate({ name: 'US Dollar' })
    // Countries
    const brazil = await Country.firstOrCreate({
      name: 'Brazil',
      code: 'BR',
      flagUrl:
        'https://sauniconnectweb.blob.core.windows.net/uniconnectweb/images/fc029acd-297a-4fdc-bd2f-05d586f95106.png',
    })
    const botswana = await Country.firstOrCreate({
      name: 'Botswana',
      code: 'BW',
      flagUrl:
        'https://sauniconnectweb.blob.core.windows.net/uniconnectweb/images/a526f447-623a-4d61-a22b-5e959c6fe553.png',
    })
    // Ltas
    const ltas = await createLtas(brazil.id, botswana.id)
    // Schools
    const botSchool = await School.firstOrCreate({
      name: 'School Bot 1',
      externalId: 1002,
      address: 'None Street',
      location1: 'Location 1',
      location2: 'Location 2',
      location3: 'Location 3',
      location4: 'Location 4',
      educationLevel: 'Primary school',
      geopoint: '10.32424, 5.84978',
      email: 'school2@school.com',
      phoneNumber: '(123) 2222-2222',
      contactPerson: 'School Owner 2',
      countryId: botswana.id,
    })
    // Permissions
    const contractWrite = await Permission.create({ name: permissions.contractWrite })
    const attachmentWrite = await Permission.create({ name: permissions.attachmentWrite })
    const attachmentRead = await Permission.create({ name: permissions.attachmentRead })
    const countryRead = await Permission.firstOrCreate({ name: permissions.countryRead })
    const contractRead = await Permission.firstOrCreate({ name: permissions.contractRead })
    const ispRead = await Permission.firstOrCreate({ name: permissions.ispRead })
    const schoolRead = await Permission.firstOrCreate({ name: permissions.schoolRead })
    const ltaRead = await Permission.firstOrCreate({ name: permissions.ltaRead })
    const metricRead = await Permission.firstOrCreate({ name: permissions.metricRead })
    // Roles
    const countryOffice = await Role.firstOrCreate({ name: roles.countryOffice }).then((role) => {
      role
        .related('permissions')
        .saveMany([countryRead, contractRead, ispRead, schoolRead, ltaRead, metricRead])
      return role
    })
    const government = await Role.firstOrCreate({ name: roles.government }).then((role) => {
      role
        .related('permissions')
        .saveMany([countryRead, contractRead, ispRead, schoolRead, ltaRead, metricRead])
      return role
    })
    const admin = await Role.firstOrCreate({ name: roles.gigaAdmin }).then((role) => {
      role
        .related('permissions')
        .saveMany([
          countryRead,
          contractRead,
          ispRead,
          schoolRead,
          contractWrite,
          attachmentWrite,
          attachmentRead,
          ltaRead,
          metricRead,
        ])
      return role
    })
    const isp = await Role.firstOrCreate({ name: roles.isp }).then((role) => {
      role
        .related('permissions')
        .saveMany([countryRead, contractRead, ispRead, schoolRead, ltaRead, metricRead])
      return role
    })
    // Isps
    const isps = await createIsps(brazil.id, botswana.id)
    // Users
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const [brUser, _, bwUser] = await Promise.all([
      //  Office Brazil 1
      User.firstOrCreate({
        name: 'Brazil',
        lastName: 'Officer 1',
        email: 'officer1_br@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: brazil.id,
      }).then((user) => {
        user.related('roles').save(countryOffice)
        return user
      }),
      //  Office Brazil 2
      User.firstOrCreate({
        name: 'Brazil',
        lastName: 'Officer 2',
        email: 'officer2_br@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: brazil.id,
      }).then((user) => user.related('roles').save(countryOffice)),
      //  Office Botswana
      User.firstOrCreate({
        name: 'Botswana',
        lastName: 'Officer',
        email: 'officer_bw@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: botswana.id,
      }).then((user) => {
        user.related('roles').save(countryOffice)
        return user
      }),
      //  Government Brazil
      User.firstOrCreate({
        name: 'Brazil',
        lastName: 'Gov',
        email: 'gov_br@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: brazil.id,
      }).then((user) => user.related('roles').save(government)),
      //  Government Botswana
      User.firstOrCreate({
        name: 'Botswana',
        lastName: 'Gov',
        email: 'gov_bw@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: botswana.id,
      }).then((user) => user.related('roles').save(government)),
      //  Giga Admin 1
      User.firstOrCreate({
        name: 'Giga',
        lastName: 'Admin 1',
        email: 'admin1@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      }).then((user) => user.related('roles').save(admin)),
      //  Giga Admin 2
      User.firstOrCreate({
        name: 'Giga',
        lastName: 'Admin 2',
        email: 'admin2@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      }).then((user) => user.related('roles').save(admin)),
      User.firstOrCreate({
        name: 'Vivo',
        lastName: 'Provider',
        email: 'provider_br@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: brazil.id,
      }).then((user) => user.related('roles').save(isp)),
      User.firstOrCreate({
        name: 'AT&T',
        lastName: 'Provider',
        email: 'provider_bw@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: botswana.id,
      }).then((user) => user.related('roles').save(isp)),
    ])
    // Contracts
    await createContracts(
      ltas,
      isps,
      brazil.id,
      botswana.id,
      brl.id,
      frequency.id,
      '1000000',
      brUser.id,
      [uptime.id, latency.id, upload.id, download.id]
    )
    await Contract.firstOrCreate({
      countryId: botswana.id,
      governmentBehalf: true,
      name: '9655154',
      currencyId: usd.id,
      budget: '2000000',
      frequencyId: frequency.id,
      startDate: DateTime.now(),
      endDate: DateTime.now(),
      ispId: isps[17].id,
      createdBy: bwUser.id,
      status: ContractStatus.Ongoing,
      ltaId: ltas[3].id,
    }).then((ctc) => {
      ctc.related('schools').save(botSchool)
      return ctc
    })
    await Draft.firstOrCreate({
      countryId: botswana.id,
      governmentBehalf: true,
      name: '9114097',
      currencyId: usd.id,
      frequencyId: frequency.id,
      createdBy: bwUser.id,
    })
  }
}
