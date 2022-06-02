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
  ispRead: 'isp.read',
  schoolRead: 'school.read',
}
