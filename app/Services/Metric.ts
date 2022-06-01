import Metric from 'App/Models/Metric'

const listMetricsSuggestedValues = async () => {
  const metrics = await Metric.all()
  // console.log(metrics)
}

export default {
  listMetricsSuggestedValues,
}
