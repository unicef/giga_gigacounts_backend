export const roles = {
  gigaAdmin: 'Giga Admin',
  countryOffice: 'Country Office',
  government: 'Government',
  isp: 'ISP',
}

export enum ContractStatus {
  Draft,
  Sent,
  Confirmed,
  Ongoing,
  Expired,
  Completed,
}

export const permissions = {
  countryRead: 'country.read',
  contractRead: 'contract.read',
  contractWrite: 'contract.write',
  ispRead: 'isp.read',
  metricRead: 'metric.read',
  schoolRead: 'school.read',
  attachmentWrite: 'attachment.write',
  attachmentRead: 'attachment.read',
  ltaRead: 'lta.read',
  ltaWrite: 'lta.write',
  measureRead: 'measure.read',
}

export const Metrics = {
  Latency: 'Latency',
  Uptime: 'Uptime',
  Download: 'Download speed',
  Upload: 'Upload speed',
}
