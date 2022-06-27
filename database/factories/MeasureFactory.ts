import Measure from 'App/Models/Measure'
import Factory from '@ioc:Adonis/Lucid/Factory'

import SchoolFactory from './SchoolFactory'
import MetricFactory from './MetricFactory'
import ContractFactory from './ContractFactory'

export default Factory.define(Measure, () => {
  return {
    value: 1,
  }
})
  .relation('school', () => SchoolFactory)
  .relation('metric', () => MetricFactory)
  .relation('contract', () => ContractFactory)
  .build()
