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
    const { default: Isp } = await import('App/Models/Isp')
    const { default: Permission } = await import('App/Models/Permission')
    const { default: Frequency } = await import('App/Models/Frequency')
    const { default: Currency } = await import('App/Models/Currency')
    const { default: School } = await import('App/Models/School')
    const { default: Contract } = await import('App/Models/Contract')
    const { default: Metric } = await import('App/Models/Metric')
    const { default: ExpectedMetric } = await import('App/Models/ExpectedMetric')
    const { default: Draft } = await import('App/Models/Draft')
    const { roles, permissions, ContractStatus } = await import('App/Helpers/constants')
    // Metrics
    const uptime = await Metric.create({
      name: 'Uptime',
    })
    const latency = await Metric.create({
      name: 'latency',
    })
    const download = await Metric.create({
      name: 'Download speed',
    })
    const upload = await Metric.create({
      name: 'Upload speed',
    })
    // Frequency
    const frequency = await Frequency.create({ name: 'Monthly' })
    // Currencies
    const brl = await Currency.create({ name: 'Brazilian Real' })
    const usd = await Currency.create({ name: 'US Dollar' })
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
    // Schools
    const [school1, school2] = await School.createMany([
      {
        name: 'School 1',
        externalId: 1001,
        address: 'None Street',
        location1: 'Location 1',
        location2: 'Location 2',
        location3: 'Location 3',
        location4: 'Location 4',
        educationLevel: 'High school',
        geopoint: '10.32424, 5.84978',
        email: 'school1@school.com',
        phoneNumber: '(123) 1111-1111',
        contactPerson: 'School Owner',
        countryId: brazil.id,
      },
      {
        name: 'School 2',
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
      },
    ])
    // Permissions
    const countryRead = await Permission.create({
      name: permissions.countryRead,
    })
    const contractRead = await Permission.create({
      name: permissions.contractRead,
    })
    const ispRead = await Permission.create({
      name: permissions.ispRead,
    })
    const schoolRead = await Permission.create({
      name: permissions.schoolRead,
    })
    // Roles
    const countryOffice = await Role.create({ name: roles.countryOffice }).then((role) => {
      role.related('permissions').saveMany([countryRead, contractRead, ispRead, schoolRead])
      return role
    })
    const government = await Role.create({ name: roles.government }).then((role) => {
      role.related('permissions').saveMany([countryRead, contractRead, ispRead, schoolRead])
      return role
    })
    const admin = await Role.create({ name: roles.gigaAdmin }).then((role) => {
      role.related('permissions').saveMany([countryRead, contractRead, ispRead, schoolRead])
      return role
    })
    const isp = await Role.create({ name: roles.isp }).then((role) => {
      role.related('permissions').saveMany([countryRead, contractRead, ispRead, schoolRead])
      return role
    })
    // Isps
    const isp1 = await Isp.create({ name: 'Vivo' })
    const isp2 = await Isp.create({ name: 'AT&T' })
    // Users
    const [brUser, _, bwUser] = await Promise.all([
      //  Office Brazil 1
      User.create({
        name: 'Brazil Officer 1',
        email: 'officer1_br@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: brazil.id,
      }).then((user) => {
        user.related('roles').save(countryOffice)
        return user
      }),
      //  Office Brazil 2
      User.create({
        name: 'Brazil Officer 2',
        email: 'officer2_br@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: brazil.id,
      }).then((user) => user.related('roles').save(countryOffice)),
      //  Office Botswana
      User.create({
        name: 'Botswana Officer',
        email: 'officer_bw@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: botswana.id,
      }).then((user) => {
        user.related('roles').save(countryOffice)
        return user
      }),
      //  Government Brazil
      User.create({
        name: 'Brazil Gov',
        email: 'gov_br@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: brazil.id,
      }).then((user) => user.related('roles').save(government)),
      //  Government Botswana
      User.create({
        name: 'Botswana Gov',
        email: 'gov_bw@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: botswana.id,
      }).then((user) => user.related('roles').save(government)),
      //  Giga Admin 1
      User.create({
        name: 'Giga Admin 1',
        email: 'admin1@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      }).then((user) => user.related('roles').save(admin)),
      //  Giga Admin 2
      User.create({
        name: 'Giga Admin 2',
        email: 'admin2@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      }).then((user) => user.related('roles').save(admin)),
      User.create({
        name: 'Vivo',
        email: 'provider_br@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: brazil.id,
      }).then((user) => user.related('roles').save(isp)),
      User.create({
        name: 'AT&T',
        email: 'provider_bw@giga.com',
        password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
        countryId: botswana.id,
      }).then((user) => user.related('roles').save(isp)),
    ])
    // Contracts
    const contract1 = await Contract.create({
      countryId: brazil.id,
      governmentBehalf: false,
      name: 'Contract Brazil 1',
      currencyId: brl.id,
      budget: '1000000',
      frequencyId: frequency.id,
      startDate: DateTime.now(),
      endDate: DateTime.now(),
      ispId: isp1.id,
      createdBy: brUser.id,
      status: ContractStatus.Sent,
    }).then((ctc) => {
      ctc.related('schools').save(school1)
      return ctc
    })
    const contract2 = await Contract.create({
      countryId: botswana.id,
      governmentBehalf: true,
      name: 'Contract Botswana 1',
      currencyId: usd.id,
      budget: '2000000',
      frequencyId: frequency.id,
      startDate: DateTime.now(),
      endDate: DateTime.now(),
      ispId: isp2.id,
      createdBy: bwUser.id,
      status: ContractStatus.Ongoing,
    }).then((ctc) => {
      ctc.related('schools').save(school2)
      return ctc
    })
    await Draft.create({
      countryId: botswana.id,
      governmentBehalf: true,
      name: 'Draft Botswana 1',
      currencyId: usd.id,
      frequencyId: frequency.id,
      createdBy: bwUser.id,
    })
    // Expected Metrics
    await ExpectedMetric.createMany([
      {
        contractId: contract1.id,
        metricId: uptime.id,
        value: 95,
      },
      {
        contractId: contract1.id,
        metricId: latency.id,
        value: 300,
      },
      {
        contractId: contract1.id,
        metricId: download.id,
        value: 100,
      },
      {
        contractId: contract1.id,
        metricId: upload.id,
        value: 3,
      },
      {
        contractId: contract2.id,
        metricId: uptime.id,
        value: 95,
      },
      {
        contractId: contract2.id,
        metricId: latency.id,
        value: 300,
      },
      {
        contractId: contract2.id,
        metricId: download.id,
        value: 100,
      },
      {
        contractId: contract2.id,
        metricId: upload.id,
        value: 3,
      },
    ])
  }
}
