import Factory from '@ioc:Adonis/Lucid/Factory'
import Safe from 'App/Models/Safe'
import User from 'App/Models/User'

export default Factory.define(Safe, ({ faker }) => {
  return {
    address: faker.random.words(),
    name: faker.random.word(),
  }
})
  .relation('users', () => User)
  .build()
