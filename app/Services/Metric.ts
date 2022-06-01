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

export default {
  listMetricsSuggestedValues,
}
