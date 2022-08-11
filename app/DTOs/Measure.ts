import Contract from 'App/Models/Contract'

import utils from 'App/Helpers/utils'
import { SchoolsConnection } from 'App/DTOs/Contract'
import ExpectedMetric from 'App/Models/ExpectedMetric'

const calculateMeasuresDTO = (contract: Contract, schoolsMedians: {}) => {
  const schoolsConnection: SchoolsConnection = {
    withoutConnection: 0,
    atLeastOneBellowAvg: 0,
    allEqualOrAboveAvg: 0,
  }

  if (contract.schools.length) {
    contract.schools.forEach((school) => {
      evaluateMedianMetrics(
        schoolsMedians[contract.name][school.name],
        contract.expectedMetrics,
        schoolsConnection
      )
    })
  }

  return {
    withoutConnection: utils.toFixedFloat(
      utils.getPercentage(contract.$extras.schools_count, schoolsConnection.withoutConnection)
    ),
    atLeastOneBellowAvg: utils.toFixedFloat(
      utils.getPercentage(contract.$extras.schools_count, schoolsConnection.atLeastOneBellowAvg)
    ),
    allEqualOrAboveAvg: utils.toFixedFloat(
      utils.getPercentage(contract.$extras.schools_count, schoolsConnection.allEqualOrAboveAvg)
    ),
  }
}

const evaluateMedianMetrics = (
  schoolsMedians: any[],
  expectedMetrics: ExpectedMetric[],
  schoolsConnection: SchoolsConnection
) => {
  if (!schoolsMedians.length) return (schoolsConnection.withoutConnection += 1)
  for (const em of expectedMetrics) {
    const index = schoolsMedians.findIndex(
      (sm) => sm.metric_id.toString() === em.metricId.toString()
    )
    if (!schoolsMedians[index] || schoolsMedians[index]?.median_value < em.value) {
      return (schoolsConnection.atLeastOneBellowAvg += 1)
    }
  }
  return (schoolsConnection.allEqualOrAboveAvg += 1)
}

export default {
  calculateMeasuresDTO,
}
