import { CurrencyType } from 'App/Helpers/constants'
import Attachment from 'App/Models/Attachment'
import Country from 'App/Models/Country'
import Draft from 'App/Models/Draft'
import Frequency from 'App/Models/Frequency'
import Isp from 'App/Models/Isp'
import School from 'App/Models/School'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

interface GetDraftDtoParams {
  draft: Draft
  attachments?: Attachment[]
  ispContacts?: User[]
  stakeholders?: User[]
  schools?: School[]
  expectedMetrics?: {
    name?: string
    value: number
    metricId: string
  }[]
}

export interface GetDraftDTOResponse {
  id: number
  name: string
  governmentBehalf?: boolean
  automatic?: boolean
  budget?: number | null
  startDate?: DateTime
  endDate?: DateTime
  launchDate?: DateTime
  country?: Country
  currency?: {
    id: string
    name: string
    code: string
    type: string
  }
  frequency?: Frequency
  isp?: Isp
  createdBy?: {
    id: number
    name: string
    email: string
    lastName: string
  } | null
  attachments?: Attachment[]
  ispContacts?: {
    id: number
    name: string
    email: string
    lastName: string
    phoneNumber?: string
    role: {
      name?: string
      code?: string
    }
  }[]
  stakeholders?: {
    id: number
    name: string
    email: string
    lastName: string
    role: {
      name?: string
      code?: string
    }
  }[]
  schools?: School[]
  expectedMetrics?: {
    name?: string
    value: number
    metricId: string
  }[]
  notes?: string
  breakingRules?: string
  paymentReceiver?: {
    id: number
    name: string
    email: string
    lastName: string
  }
}

const getDraftDTO = ({
  draft,
  schools,
  expectedMetrics
}: GetDraftDtoParams): GetDraftDTOResponse => {
  const combinedContacts = [
    ...(draft.ispContacts || []).map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      lastName: contact.lastName,
      phoneNumber: contact.phoneNumber,
      role: {
        code: contact.roles[0]?.code,
        name: contact.roles[0]?.name
      }
    })),
    ...(draft.externalContacts || []).map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      lastName: '',
      phoneNumber: contact.phoneNumber,
      role: {
        code: '',
        name: 'External Contact'
      }
    }))
  ]

  return {
    id: draft.id,
    name: draft.name,
    governmentBehalf: draft.governmentBehalf,
    automatic: draft.automatic,
    budget: draft.budget,
    startDate: draft.startDate,
    endDate: draft.endDate,
    launchDate: draft.launchDate,
    country: draft.country,
    currency: draft.currency
      ? {
          id: draft.currency.id.toString(),
          name: draft.currency.name,
          code: draft.currency.code,
          type: CurrencyType[draft.currency.type]
        }
      : undefined,
    frequency: draft.frequency,
    isp: draft.isp,
    createdBy: draft.user
      ? {
          id: draft?.user.id,
          name: draft?.user.name,
          email: draft?.user.email,
          lastName: draft?.user.lastName
        }
      : null,
    attachments: draft?.attachments,
    ispContacts: combinedContacts.map((combinedContact) => ({
      id: combinedContact.id,
      name: combinedContact.name,
      email: combinedContact.email,
      lastName: combinedContact.lastName,
      phoneNumber: combinedContact.phoneNumber,
      role: {
        code: combinedContact.role.code,
        name: combinedContact.role.name
      }
    })),
    stakeholders: draft?.stakeholders.map((stakeHolder) => ({
      id: stakeHolder.id,
      name: stakeHolder.name,
      email: stakeHolder.email,
      lastName: stakeHolder.lastName,
      phoneNumber: stakeHolder.phoneNumber,
      role: {
        code: stakeHolder.roles[0]?.code,
        name: stakeHolder.roles[0]?.name
      }
    })),
    schools,
    expectedMetrics,
    notes: draft.notes,
    breakingRules: draft.breakingRules,
    paymentReceiver: {
      id: draft.paymentReceiver?.id,
      name: draft.paymentReceiver?.name,
      lastName: draft.paymentReceiver?.lastName,
      email: draft.paymentReceiver?.email
    }
  }
}

export default {
  getDraftDTO
}
