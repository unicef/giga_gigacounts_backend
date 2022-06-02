import SuggestedMetric from 'App/Models/SuggestedMetric'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(SuggestedMetric, ({ faker }) => {
  return {
    value: faker.random.numeric(),
    unit: faker.random.word(),
  }
}).build()
