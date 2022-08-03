import Role from 'App/Models/Role'
import User from 'App/Models/User'
import { roles } from 'App/Helpers/constants'

export const createUser = (brazilId: number, botswanaId: number, _roles: Role[]) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _getRoleByName = getRoleByName(_roles)
  return Promise.all([
    //  Giga Admin 1
    User.firstOrCreate({
      name: 'Giga',
      lastName: 'Admin 1',
      email: 'admin1@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
    }).then((user) => {
      user.related('roles').save(_getRoleByName(roles.gigaAdmin))
      return user
    }),
    //  Office Brazil 1
    User.firstOrCreate({
      name: 'Brazil',
      lastName: 'Officer 1',
      email: 'officer1_br@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      countryId: brazilId,
    }).then((user) => {
      user.related('roles').save(_getRoleByName(roles.countryOffice))
    }),
    //  Office Brazil 2
    User.firstOrCreate({
      name: 'Brazil',
      lastName: 'Officer 2',
      email: 'officer2_br@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      countryId: brazilId,
    }).then((user) => user.related('roles').save(_getRoleByName(roles.countryOffice))),
    //  Office Botswana
    User.firstOrCreate({
      name: 'Botswana',
      lastName: 'Officer',
      email: 'officer_bw@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      countryId: botswanaId,
    }).then((user) => {
      user.related('roles').save(_getRoleByName(roles.countryOffice))
    }),
    //  Government Brazil
    User.firstOrCreate({
      name: 'Brazil',
      lastName: 'Gov',
      email: 'gov_br@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      countryId: brazilId,
    }).then((user) => user.related('roles').save(_getRoleByName(roles.government))),
    //  Government Botswana
    User.firstOrCreate({
      name: 'Botswana',
      lastName: 'Gov',
      email: 'gov_bw@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      countryId: botswanaId,
    }).then((user) => user.related('roles').save(_getRoleByName(roles.government))),
    //  Giga Admin 2
    User.firstOrCreate({
      name: 'Giga',
      lastName: 'Admin 2',
      email: 'admin2@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
    }).then((user) => user.related('roles').save(_getRoleByName(roles.gigaAdmin))),
    User.firstOrCreate({
      name: 'Vivo',
      lastName: 'Provider',
      email: 'provider_br@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      countryId: brazilId,
    }).then((user) => user.related('roles').save(_getRoleByName(roles.isp))),
    User.firstOrCreate({
      name: 'AT&T',
      lastName: 'Provider',
      email: 'provider_bw@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      countryId: botswanaId,
    }).then((user) => user.related('roles').save(_getRoleByName(roles.isp))),
  ])
}

const getRoleByName = (_roles: Role[]) => (name: string) =>
  _roles.find((r) => r.name === name) || _roles[0]
