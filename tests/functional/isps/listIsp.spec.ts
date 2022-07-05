import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import IspFactory from 'Database/factories/IspFactory'
import UserFactory from 'Database/factories/UserFactory'
import CountryFactory from 'Database/factories/CountryFactory'

import Isp from 'App/Models/Isp'

test.group('List ISPs', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return all ISPs', async ({ client, expect }) => {
    await IspFactory.merge([
      {
        name: 'T-Mobile',
      },
      {
        name: 'Verizon',
      },
      {
        name: 'AT&T',
      },
    ]).createMany(3)
    const user = await UserFactory.with('country', 1)
      .with('roles', 1, (role) =>
        role.with('permissions', 1, (permission) => permission.merge({ name: 'isp.read' }))
      )
      .create()
    const response = await client.get('/isp').loginAs(user)
    const isps = response.body() as Isp[]
    expect(isps.length).toBe(3)
    expect(isps.some((i) => i.name === 'T-Mobile')).toBeTruthy()
    expect(isps.some((i) => i.name === 'Verizon')).toBeTruthy()
    expect(isps.some((i) => i.name === 'AT&T')).toBeTruthy()
  })
  test('Succesfully return all ISPs by Country', async ({ client, expect }) => {
    const country = await CountryFactory.create()
    const country2 = await CountryFactory.merge({ name: 'countryTwo' }).create()
    const isp1 = await IspFactory.merge({ countryId: country.id, name: 'T-Mobile' }).create()
    const isp2 = await IspFactory.merge({ countryId: country.id, name: 'Verizon' }).create()
    const isp3 = await IspFactory.merge({ countryId: country2.id, name: 'AT&T' }).create()
    const user = await UserFactory.merge({ countryId: country.id })
      .with('roles', 1, (role) =>
        role.with('permissions', 1, (permission) => permission.merge({ name: 'isp.read' }))
      )
      .create()
    const response = await client.get(`/isp?countryId=${country.id}`).loginAs(user)
    const isps = response.body() as Isp[]
    expect(isps.length).toBe(2)
    expect(isps.some((i) => i.name === isp1.name)).toBeTruthy()
    expect(isps.some((i) => i.name === isp2.name)).toBeTruthy()
    expect(isps.some((i) => i.name === isp3.name)).toBeFalsy()
  })
  test('Succesfully return all ISPs by LTA', async ({ client, expect }) => {
    const country = await CountryFactory.create()
    const att = await IspFactory.merge({ name: 'AT&T', countryId: country.id })
      .with('ltas', 1)
      .create()
    await IspFactory.merge({ name: 'T-Mobile', countryId: country.id }).with('ltas', 1).create()
    await IspFactory.merge({ name: 'Verizon', countryId: country.id }).create()
    const user = await UserFactory.merge({ countryId: country.id })
      .with('roles', 1, (role) =>
        role.with('permissions', 1, (permission) => permission.merge({ name: 'isp.read' }))
      )
      .create()
    const response = await client.get(`/isp?ltaId=${att.ltas[0].id}`).loginAs(user)
    const isps = response.body() as Isp[]
    expect(isps.length).toBe(1)
    expect(isps.some((i) => i.name === 'T-Mobile')).toBeFalsy()
    expect(isps.some((i) => i.name === 'Verizon')).toBeFalsy()
    expect(isps.some((i) => i.name === 'AT&T')).toBeTruthy()
  })
})
