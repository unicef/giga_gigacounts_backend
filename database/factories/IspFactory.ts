import Isp from 'App/Models/Isp'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Isp, ({ faker }) => {
  return {
    name: 'T-Mobile',
  }
}).build()
