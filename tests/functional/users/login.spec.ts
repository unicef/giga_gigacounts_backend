import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import UserFactory from 'Database/factories/UserFactory'

test.group('Login', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('Succefully return a jwt token when credentials are ok', async ({
    client,
    expect,
    assert,
  }) => {
    const user = await UserFactory.create()
    const response = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })
    const token = response.body()
    expect(token.type).toBe('bearer')
    assert.notEmpty(token.token)
  })
  test('Throws a error when email is missing', async ({ client, expect }) => {
    const response = await client.post('/login').json({
      password: '123456',
    })
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe('required validation failed')
    expect(JSON.parse(error.text).errors[0].field).toBe('email')
  })
  test('Throws a error when password is missing', async ({ client, expect }) => {
    const response = await client.post('/login').json({
      email: 'email@email.com',
    })
    const error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(422)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe('required validation failed')
    expect(JSON.parse(error.text).errors[0].field).toBe('password')
  })
  test('Throws a error when the credentials are wrong', async ({ client, expect }) => {
    const user = await UserFactory.create()
    let response = await client.post('/login').json({
      email: user.email,
      password: '1234562',
    })
    let error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(400)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe('Wrong email or password')
    // with wrong email
    response = await client.post('/login').json({
      email: 'wrong@email.com',
      password: '123456',
    })
    error = response.error() as import('superagent').HTTPError
    expect(error.status).toBe(400)
    expect(JSON.parse(error.text).errors.length).toBe(1)
    expect(JSON.parse(error.text).errors[0].message).toBe('Wrong email or password')
  })
})
