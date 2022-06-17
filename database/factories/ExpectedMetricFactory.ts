import ExpectedMetric from 'App/Models/ExpectedMetric'
import Factory from '@ioc:Adonis/Lucid/Factory'

import ContractFactory from './ContractFactory'
import MetricFactory from './MetricFactory'

export default Factory.define(ExpectedMetric, () => {
  return {
    value: 1,
  }
})
  .relation('contract', () => ContractFactory)
  .relation('metric', () => MetricFactory)
  .build()

// .relation('suggestedMetrics', () => SuggestedMetricFactory)
