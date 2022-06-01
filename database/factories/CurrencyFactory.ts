import Currency from 'App/Models/Currency'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Currency, () => {
  return {
    name: 'US Dollar',
  }
}).build()
