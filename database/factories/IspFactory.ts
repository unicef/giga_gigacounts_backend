import Isp from 'App/Models/Isp'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Isp, () => {
  return {
    name: 'T-Mobile',
  }
}).build()
