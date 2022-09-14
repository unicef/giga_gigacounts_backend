import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import LtaFactory from 'Database/factories/LtaFactory'
import UserFactory from 'Database/factories/UserFactory'
import CountryFactory from 'Database/factories/CountryFactory'

import Lta from 'App/Models/Lta'

test.group('List LTAs', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Successfully return all LTAs', async ({ client, expect }) => {
    const country = await CountryFactory.create()
    const country2 = await CountryFactory.merge({ name: 'countryTwo' }).create()
    await LtaFactory.merge([
      {
        name: 'LLTS-1234',
        countryId: country.id,
      },
      {
        name: 'LLTS-5678',
        countryId: country.id,
      },
      {
        name: 'LLTS-9999',
        countryId: country2.id,
      },
    ]).createMany(3)
    const user = await UserFactory.merge({ countryId: country.id })
      .with('roles', 1, (role) =>
        role
          .merge({ name: 'Giga Admin' })
          .with('permissions', 1, (permission) => permission.merge({ name: 'lta.read' }))
      )
      .create()
    const response = await client.get('/lta').loginAs(user)
    const ltas = response.body() as Lta[]
    expect(ltas.length).toBe(3)
    expect(ltas.some((i) => i.name === 'LLTS-1234')).toBeTruthy()
    expect(ltas.some((i) => i.name === 'LLTS-5678')).toBeTruthy()
    expect(ltas.some((i) => i.name === 'LLTS-9999')).toBeTruthy()
  })
  test('Successfully return all LTAs by country', async ({ client, expect }) => {
    const country = await CountryFactory.create()
    const country2 = await CountryFactory.merge({ name: 'countryTwo' }).create()
    await LtaFactory.merge([
      {
        name: 'LLTS-1234',
        countryId: country.id,
      },
      {
        name: 'LLTS-5678',
        countryId: country.id,
      },
      {
        name: 'LLTS-9999',
        countryId: country2.id,
      },
    ]).createMany(3)
    const user = await UserFactory.merge({ countryId: country.id })
      .with('roles', 1, (role) =>
        role.with('permissions', 1, (permission) => permission.merge({ name: 'lta.read' }))
      )
      .create()
    const response = await client.get(`/lta?countryId=${country.id}`).loginAs(user)
    const ltas = response.body() as Lta[]
    expect(ltas.length).toBe(2)
    expect(ltas.some((i) => i.name === 'LLTS-1234')).toBeTruthy()
    expect(ltas.some((i) => i.name === 'LLTS-5678')).toBeTruthy()
    expect(ltas.some((i) => i.name === 'LLTS-9999')).toBeFalsy()
  })
  test('Successfully return all LTAs by country if a user is country office', async ({
    client,
    expect,
  }) => {
    const country = await CountryFactory.create()
    const country2 = await CountryFactory.merge({ name: 'countryTwo' }).create()
    await LtaFactory.merge([
      {
        name: 'LLTS-1234',
        countryId: country.id,
      },
      {
        name: 'LLTS-5678',
        countryId: country.id,
      },
      {
        name: 'LLTS-9999',
        countryId: country2.id,
      },
    ]).createMany(3)
    const user = await UserFactory.merge({ countryId: country.id })
      .with('roles', 1, (role) =>
        role
          .merge({ name: 'Country Office' })
          .with('permissions', 1, (permission) => permission.merge({ name: 'lta.read' }))
      )
      .create()
    const response = await client.get('/lta').loginAs(user)
    const ltas = response.body() as Lta[]
    expect(ltas.length).toBe(2)
    expect(ltas.some((i) => i.name === 'LLTS-1234')).toBeTruthy()
    expect(ltas.some((i) => i.name === 'LLTS-5678')).toBeTruthy()
    expect(ltas.some((i) => i.name === 'LLTS-9999')).toBeFalsy()
  })
  test('Successfully return all LTAs by country if a user is gov', async ({ client, expect }) => {
    const country = await CountryFactory.create()
    const country2 = await CountryFactory.merge({ name: 'countryTwo' }).create()
    await LtaFactory.merge([
      {
        name: 'LLTS-1234',
        countryId: country.id,
      },
      {
        name: 'LLTS-5678',
        countryId: country.id,
      },
      {
        name: 'LLTS-9999',
        countryId: country2.id,
      },
    ]).createMany(3)
    const user = await UserFactory.merge({ countryId: country.id })
      .with('roles', 1, (role) =>
        role
          .merge({ name: 'Government' })
          .with('permissions', 1, (permission) => permission.merge({ name: 'lta.read' }))
      )
      .create()
    const response = await client.get('/lta').loginAs(user)
    const ltas = response.body() as Lta[]
    expect(ltas.length).toBe(2)
    expect(ltas.some((i) => i.name === 'LLTS-1234')).toBeTruthy()
    expect(ltas.some((i) => i.name === 'LLTS-5678')).toBeTruthy()
    expect(ltas.some((i) => i.name === 'LLTS-9999')).toBeFalsy()
  })
})
