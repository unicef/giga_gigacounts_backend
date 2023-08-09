export const roles = {
  gigaAdmin: 'GIGA.SUPER.ADMIN',
  gigaViewOnly: 'GIGA.VIEW.ONLY',
  ispContractManager: 'ISP.CONTRACT.MANAGER',
  ispCustomerService: 'ISP.CUSTOMER.SERVICE',
  countryContractCreator: 'COUNTRY.CONTRACT.CREATOR',
  countryAccountant: 'COUNTRY.ACCOUNTANT',
  countrySuperAdmin: 'COUNTRY.SUPER.ADMIN',
  countryMonitor: 'COUNTRY.MONITOR',
  schoolConnectivityManager: 'SCHOOL.CONNECTIVITY.MANAGER'
}

export enum ContractStatus {
  Draft = 1,
  Sent, // == publish
  Confirmed, // == approve
  Ongoing,
  Expired,
  Completed
}

export enum PaymentStatus {
  OnHold,
  Unpaid,
  Verified,
  Paid
}

export enum CurrencyType {
  fiat = 1,
  stable = 2
}

export const frequencyNames = {
  Weekly: 'Weekly',
  Biweekly: 'Biweekly',
  Monthly: 'Monthly'
}

export const permissions = {
  contractRead: 'contract.read',
  contractWrite: 'contract.write',
  contractApprove: 'contract.approve',
  paymentRead: 'payment.read',
  paymentWrite: 'payment.write',
  attachmentRead: 'attachment.read',
  attachmentWrite: 'attachment.write',
  metricRead: 'metric.read',
  metricWrite: 'metric.write',
  measureRead: 'measure.read',
  measureWrite: 'measure.write',
  safeRead: 'safe.read',
  safeWrite: 'safe.write',
  ltaWrite: 'lta.write',
  ltaRead: 'lta.read',
  ispRead: 'isp.read',
  ispWrite: 'isp.write',
  schoolRead: 'school.read',
  schoolWrite: 'school.write',
  countryRead: 'country.read',
  walletRead: 'wallet.read',
  walletWrite: 'wallet.write',
  contractSignWithWallet: 'contract.sign.with.wallet',
  userRead: 'user.read',
  userWrite: 'user.write',
  blockchainTransactionsRead: 'blockchainTransactions.read',
  blockchainTransactionsWrite: 'blockchainTransactions.write',
  userSettingsRead: 'user.settings.read',
  userSettingsWrite: 'user.settings.write'
}

export const Metrics = {
  Latency: 'Latency',
  Uptime: 'Uptime',
  Download: 'Download speed',
  Upload: 'Upload speed'
}

export const NotificationSources = {
  resetPassword: 'PWDRST',
  manualContractCreation: 'CONCRTM',
  automaticContractCreation: 'CONCRTA',
  feedback: 'FDBACK',
  slaNotMet: 'SLAKO'
}

export type NotificationChannel = 'EMAIL' | 'PUSH' | 'API'

export type NotificationStatus = 'CREATED' | 'SENT' | 'READ' | 'DELETED' | 'DISCARDED'

export const requestsFormatDate = 'iso'
