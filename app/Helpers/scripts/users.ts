import Role from 'App/Models/Role'
import User from 'App/Models/User'
import { roles } from 'App/Helpers/constants'
import Isp from 'App/Models/Isp'
import Safe from 'App/Models/Safe'

export const createUser = async (
  brazilId: number,
  botswanaId: number,
  _roles: Role[],
  isps: Isp[]
) => {
  const safes = await Safe.all()
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _getRoleByName = getRoleByName(_roles)
  return Promise.all([
    //  Giga Admin 1
    User.firstOrCreate({
      name: 'Giga',
      lastName: 'Admin 1',
      email: 'admin1@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      walletAddress: '0xF9ed30977C2BcC32470e4E2763d814B7Cbe31009',
      safeId: safes.find((safe) => safe.name === 'Giga Admin')?.id,
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
      walletAddress: '0xA3eCFc441A94b41EfF6E422E34E6c6BD5366353F',
      safeId: safes.find((safe) => safe.name === 'Country Office.Brazil')?.id,
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
      walletAddress: '0xAdA63032d72511494719C7219069e04522F23326',
      safeId: safes.find((safe) => safe.name === 'Country Office.Brazil')?.id,
    }).then((user) => user.related('roles').save(_getRoleByName(roles.countryOffice))),
    //  Office Botswana
    User.firstOrCreate({
      name: 'Botswana',
      lastName: 'Officer',
      email: 'officer_bw@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      countryId: botswanaId,
      walletAddress: '0x541F7028c1045b5EeB9D5a38C1241B0118Cb3c93',
      safeId: safes.find((safe) => safe.name === 'Country Office.Botswana')?.id,
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
      walletAddress: '0xb4C9985d4e6BfDb2a3FeB99462115b59963088b9',
      safeId: safes.find((safe) => safe.name === 'Government.Brazil')?.id,
    }).then((user) => user.related('roles').save(_getRoleByName(roles.government))),
    //  Government Botswana
    User.firstOrCreate({
      name: 'Botswana',
      lastName: 'Gov',
      email: 'gov_bw@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      countryId: botswanaId,
      walletAddress: '0x82D668F0DC8f98e94ad7dd2dFb4f3c14101A8B3d',
      safeId: safes.find((safe) => safe.name === 'Government.Botswana')?.id,
    }).then((user) => user.related('roles').save(_getRoleByName(roles.government))),
    //  Giga Admin 2
    User.firstOrCreate({
      name: 'Giga',
      lastName: 'Admin 2',
      email: 'admin2@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      walletAddress: '0x144A61F3685f0A8148Ed25135F9fb639aE482508',
      safeId: safes.find((safe) => safe.name === 'Giga Admin')?.id,
    }).then((user) => user.related('roles').save(_getRoleByName(roles.gigaAdmin))),
    User.firstOrCreate({
      name: 'Provider',
      lastName: 'Brazil',
      email: 'provider_br@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      countryId: brazilId,
      walletAddress: '0x93d0D2b299865C488e6C2ff6BF0B39e1BdB63422',
      safeId: safes.find((safe) => safe.name === 'Vivo')?.id,
    }).then(async (user) => {
      await user.related('roles').save(_getRoleByName(roles.isp))
      await user.related('isp').save(isps[10])
    }),
    User.firstOrCreate({
      name: 'Provider',
      lastName: 'Botswana',
      email: 'provider_bw@giga.com',
      password: '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      countryId: botswanaId,
      walletAddress: '0x7D680C1E21b7360aB5Cc89aDe494BDA91Dd69be9',
      safeId: safes.find((safe) => safe.name === 'T-Mobile Botswana')?.id,
    }).then(async (user) => {
      await user.related('roles').save(_getRoleByName(roles.isp))
      await user.related('isp').save(isps[17])
    }),
  ])
}

const getRoleByName = (_roles: Role[]) => (name: string) =>
  _roles.find((r) => r.name === name) || _roles[0]
