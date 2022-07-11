import Metric from 'App/Models/Metric'
import Factory from '@ioc:Adonis/Lucid/Factory'

import SuggestedMetricFactory from './SuggestedMetricFactory'

export default Factory.define(Metric, ({ faker }) => {
  return {
    name: faker.random.words(),
    unit: faker.random.word(),
  }
})
  .relation('suggestedMetrics', () => SuggestedMetricFactory)
  .build()
