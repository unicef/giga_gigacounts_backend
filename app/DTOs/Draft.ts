import Attachment from 'App/Models/Attachment'
import Country from 'App/Models/Country'
import Currency from 'App/Models/Currency'
import Draft from 'App/Models/Draft'
import Frequency from 'App/Models/Frequency'
import Isp from 'App/Models/Isp'
import School from 'App/Models/School'
import { DateTime } from 'luxon'

interface GetDraftDtoParams {
  draft: Draft
  attachments?: Attachment[]
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
  budget?: string
  startDate?: DateTime
  endDate?: DateTime
  country?: Country
  currency?: Currency
  frequency?: Frequency
  isp?: Isp
  lta?: {
    id: number
    name: string
  } | null
  createdBy?: {
    id: number
    name: string
    email: string
    lastName: string
  } | null
  attachments?: Attachment[]
  schools?: School[]
  expectedMetrics?: {
    name?: string
    value: number
    metricId: string
  }[]
}

const getDraftDTO = ({
  draft,
  schools,
  expectedMetrics,
}: GetDraftDtoParams): GetDraftDTOResponse => {
  return {
    id: draft.id,
    name: draft.name,
    governmentBehalf: draft.governmentBehalf,
    budget: draft.budget,
    startDate: draft.startDate,
    endDate: draft.endDate,
    country: draft.country,
    currency: draft.currency,
    frequency: draft.frequency,
    isp: draft.isp,
    lta: draft.lta
      ? {
          id: draft?.lta.id,
          name: draft?.lta.name,
        }
      : null,
    createdBy: draft.user
      ? {
          id: draft?.user.id,
          name: draft?.user.name,
          email: draft?.user.email,
          lastName: draft?.user.lastName,
        }
      : null,
    attachments: draft?.attachments,
    schools,
    expectedMetrics,
  }
}

export default {
  getDraftDTO,
}
