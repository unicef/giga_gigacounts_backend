export const roles = {
  gigaAdmin: 'GIGA.SUPER.ADMIN',
  gigaViewOnly: 'GIGA.VIEW.ONLY',
  ispContractManager: 'ISP.CONTRACT.MANAGER',
  ispCustomerService: 'ISP.CUSTOMER.SERVICE',
  countryContractCreator: 'COUNTRY.CONTRACT.CREATOR',
  countryAccountant: 'COUNTRY.ACCOUNTANT',
  countrySuperAdmin: 'COUNTRY.SUPER.ADMIN',
  countryMonitor: 'COUNTRY.MONITOR',
  schoolConnectivityManager: 'SCHOOL.CONNECTIVITY.MANAGER',
  InternalContractCreator: 'INTERNAL.CONTRACT.CREATOR',
  InternalServiceScheduler: 'INTERNAL.SERVICE.SCHEDULER'
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
  Draft,
  Unpaid,
  Paid
}

export enum CurrencyType {
  fiat = 1,
  stable = 2
}

export const frequencyNames = {
  Weekly: 'Weekly',
  Biweekly: 'Biweekly',
  Monthly: 'Monthly',
  Daily: 'Daily'
}

export const permissions = {
  contractRead: 'contract.read',
  contractWrite: 'contract.write',
  contractApprove: 'contract.approve',
  contractDuplicate: 'contract.duplicate',
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
  manualContractCreated: 'MCONCRT',
  manualContractPublished: 'MCONPUB',
  manualContractApproved: 'MCONAPP',
  manualContractExpired: 'MCONEXP',
  manualContractCompleted: 'MCONEND',
  automaticContractCreated: 'ACONCRT',
  automaticContractPublished: 'ACONPUB',
  automaticContractApproved: 'ACONAPP',
  automaticContractExpired: 'ACONEXP',
  automaticContractCompleted: 'ACONEND',
  automaticContractCashback: 'ACONCSB',
  automaticContractGeneric: 'ACONGEN',
  manualPaymentCreated: 'MPAYCRT',
  manualPaymentAccepted: 'MPAYAPP',
  automaticPaymentCreated: 'APAYCRT',
  feedback: 'FDBACK',
  helpRequest: 'HELPREQ',
  slaNotMet: 'SLAKO'
} as const

export const NotificationChannel = {
  EMAIL: 'EMAIL',
  PUSH: 'PUSH',
  API: 'API'
} as const
export type NotificationChannelType = keyof typeof NotificationChannel

export const NotificationStatus = {
  CREATED: 'CREATED',
  SENT: 'SENT',
  READ: 'READ',
  DELETED: 'DELETED',
  DISCARDED: 'DISCARDED'
} as const
export type NotificationStatusType = keyof typeof NotificationStatus

export const requestsFormatDate = 'iso'

export const schedulerUserEmail = 'giga.scheduler@giga.com'
export const adminUserEmail = 'admin@giga.com'
