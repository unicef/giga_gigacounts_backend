import Metric from 'App/Models/Metric'
import SuggestedMetric from 'App/Models/SuggestedMetric'

export const createMetrics = async () => {
  const uptime = await Metric.firstOrCreate({ name: 'Uptime', weight: 35, unit: '%' })
  const latency = await Metric.firstOrCreate({ name: 'Latency', weight: 15, unit: 'ms' })
  const download = await Metric.firstOrCreate({ name: 'Download speed', weight: 30, unit: 'Mb/s' })
  const upload = await Metric.firstOrCreate({ name: 'Upload speed', weight: 20, unit: 'Mb/s' })
  await Promise.all([
    SuggestedMetric.firstOrCreate({ metricId: uptime.id, value: '100', unit: '%' }),
    SuggestedMetric.firstOrCreate({ metricId: uptime.id, value: '98', unit: '%' }),
    SuggestedMetric.firstOrCreate({ metricId: uptime.id, value: '96', unit: '%' }),
    SuggestedMetric.firstOrCreate({ metricId: uptime.id, value: '94', unit: '%' }),
    SuggestedMetric.firstOrCreate({ metricId: latency.id, value: '300', unit: 'ms' }),
    SuggestedMetric.firstOrCreate({ metricId: latency.id, value: '200', unit: 'ms' }),
    SuggestedMetric.firstOrCreate({ metricId: latency.id, value: '100', unit: 'ms' }),
    SuggestedMetric.firstOrCreate({ metricId: latency.id, value: '50', unit: 'ms' }),
    SuggestedMetric.firstOrCreate({ metricId: download.id, value: '50', unit: 'Mb/s' }),
    SuggestedMetric.firstOrCreate({ metricId: download.id, value: '30', unit: 'Mb/s' }),
    SuggestedMetric.firstOrCreate({ metricId: download.id, value: '20', unit: 'Mb/s' }),
    SuggestedMetric.firstOrCreate({ metricId: upload.id, value: '30', unit: 'Mb/s' }),
    SuggestedMetric.firstOrCreate({ metricId: upload.id, value: '20', unit: 'Mb/s' }),
    SuggestedMetric.firstOrCreate({ metricId: upload.id, value: '10', unit: 'Mb/s' }),
  ])
  return [uptime.id, latency.id, download.id, upload.id]
}
