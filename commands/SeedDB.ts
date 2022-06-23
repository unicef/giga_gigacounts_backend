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
    const { default: Draft } = await import('App/Models/Draft')
    const { default: Lta } = await import('App/Models/Lta')
    const { roles, permissions, ContractStatus } = await import('App/Helpers/constants')
    const { createContracts, createSchools } = await import('App/Helpers/contractSchools')
    // Metrics
    const uptime = await Metric.firstOrCreate({ name: 'Uptime' })
    const latency = await Metric.firstOrCreate({ name: 'Latency' })
    const download = await Metric.firstOrCreate({ name: 'Download speed' })
    const upload = await Metric.firstOrCreate({ name: 'Upload speed' })
    // Frequency
    const frequency = await Frequency.firstOrCreate({ name: 'Monthly' })
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
    const ltaOne = await Lta.firstOrCreate({ name: 'LLTS-1234', countryId: brazil.id })
    const ltaTwo = await Lta.firstOrCreate({ name: 'LLTS-5678', countryId: brazil.id })
    const ltaThree = await Lta.firstOrCreate({ name: 'LLTS-7890', countryId: botswana.id })
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
    const brazilSchools = await createSchools(brazil.id, [
      uptime.id,
      latency.id,
      download.id,
      upload.id,
    ])
    // Permissions
    const contractWrite = await Permission.create({ name: permissions.contractWrite })
    const attachmentWrite = await Permission.create({ name: permissions.attachmentWrite })
    const attachmentRead = await Permission.create({ name: permissions.attachmentRead })
    const countryRead = await Permission.firstOrCreate({ name: permissions.countryRead })
    const contractRead = await Permission.firstOrCreate({ name: permissions.contractRead })
    const ispRead = await Permission.firstOrCreate({ name: permissions.ispRead })
    const schoolRead = await Permission.firstOrCreate({ name: permissions.schoolRead })
    // Roles
    const countryOffice = await Role.firstOrCreate({ name: roles.countryOffice }).then((role) => {
      role.related('permissions').saveMany([countryRead, contractRead, ispRead, schoolRead])
      return role
    })
    const government = await Role.firstOrCreate({ name: roles.government }).then((role) => {
      role.related('permissions').saveMany([countryRead, contractRead, ispRead, schoolRead])
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
        ])
      return role
    })
    const isp = await Role.firstOrCreate({ name: roles.isp }).then((role) => {
      role.related('permissions').saveMany([countryRead, contractRead, ispRead, schoolRead])
      return role
    })
    // Isps
    const isp1 = await Isp.firstOrCreate({ name: 'Vivo' })
    const isp2 = await Isp.firstOrCreate({ name: 'AT&T' })
    const isp3 = await Isp.firstOrCreate({ name: 'Verizon Communications' })
    // Users
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
      brazil.id,
      brl.id,
      frequency.id,
      brUser.id,
      isp1.id,
      [ltaOne.id, ltaTwo.id],
      brazilSchools,
      [uptime.id, latency.id, download.id, upload.id],
      isp3.id
    )
    await Contract.firstOrCreate({
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
      ltaId: ltaThree.id,
    }).then((ctc) => {
      ctc.related('schools').save(botSchool)
      return ctc
    })
    await Draft.firstOrCreate({
      countryId: botswana.id,
      governmentBehalf: true,
      name: 'Draft Botswana 1',
      currencyId: usd.id,
      frequencyId: frequency.id,
      createdBy: bwUser.id,
    })
  }
}
