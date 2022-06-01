import Frequency from 'App/Models/Frequency'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Frequency, () => {
  return {
    name: 'Monthly',
  }
}).build()
