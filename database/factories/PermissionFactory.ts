import Permission from 'App/Models/Permission'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Permission, () => {
  return {
    name: 'country.read',
  }
}).build()
