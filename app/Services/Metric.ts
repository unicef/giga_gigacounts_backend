import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import ExpectedMetric from 'App/Models/ExpectedMetric'
import Metric from 'App/Models/Metric'

const listMetricsSuggestedValues = async () => {
  const metrics = await Metric.query().preload('suggestedMetrics')
  await Promise.all(
    metrics.map(async (m) => {
      await m.load('suggestedMetrics')
    })
  )
  return metrics
}

const createExpectedMetrics = async (
  metrics: { metricId: string; value: number }[],
  contractId: number,
  trx: TransactionClientContract
): Promise<ExpectedMetric[]> => {
  return Promise.all(
    metrics.map(async (m) =>
      ExpectedMetric.create(
        { metricId: parseInt(m.metricId), contractId, value: m.value },
        { client: trx }
      )
    )
  )
}

export default {
  listMetricsSuggestedValues,
  createExpectedMetrics,
}
