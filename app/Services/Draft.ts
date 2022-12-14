import Database from '@ioc:Adonis/Lucid/Database'

import NotFoundException from 'App/Exceptions/NotFoundException'
import FailedDependencyException from 'App/Exceptions/FailedDependencyException'
import Draft from 'App/Models/Draft'
import Metric from 'App/Models/Metric'
import School from 'App/Models/School'
import Attachment from 'App/Models/Attachment'

import dto from 'App/DTOs/Draft'
import userService from 'App/Services/User'
import { roles } from 'App/Helpers/constants'
import User from 'App/Models/User'
import utils from 'App/Helpers/utils'

export interface DraftData {
  id: number
  name?: string
  countryId?: number
  governmentBehalf?: boolean
  ltaId?: number
  currencyId?: number
  budget?: string
  frequencyId?: number
  startDate?: string
  endDate?: string
  ispId?: number
  createdBy?: number
  attachments?: { attachments: { id: number }[] }
  schools?: { schools: { id: string }[] }
  expectedMetrics?: { metrics: { metricId: string; value: number }[] }
}

const getDraft = async (draftId: number) => {
  const draft = await Draft.find(draftId)

  if (!draft) throw new NotFoundException('Draft not found', 404, 'NOT_FOUND')

  await draft.load('country')
  await draft.load('currency')
  await draft.load('frequency')
  await draft.load('isp')
  await draft.load('lta')
  await draft.load('user')
  await draft.load('attachments')

  const schools = await School.findMany(destructDraftsArray(draft.schools?.schools))

  const expectedMetrics: { name?: string; value: number; metricId: string }[] = []

  if (draft.expectedMetrics?.metrics) {
    await Promise.all(
      draft.expectedMetrics?.metrics.map(async (metric) => {
        const metricFound = await Metric.find(metric.metricId)
        expectedMetrics.push({
          name: metricFound?.name,
          value: metric.value,
          metricId: metric.metricId.toString(),
        })
      })
    )
  }

  return dto.getDraftDTO({ draft, schools, expectedMetrics })
}

const saveDraft = async (draftData: DraftData, user: User): Promise<Draft> => {
  return Draft.create({
    name: draftData.name,
    countryId: draftData.countryId,
    ltaId: draftData.ltaId,
    currencyId: draftData.currencyId,
    budget: draftData.budget,
    frequencyId: draftData.frequencyId,
    ispId: draftData.ispId,
    createdBy: draftData.createdBy,
    schools: draftData.schools,
    expectedMetrics: draftData.expectedMetrics,
    governmentBehalf: isGovernmentBehalf(user, draftData.governmentBehalf),
    startDate: draftData.startDate
      ? utils.formatContractDate(draftData?.startDate, true)
      : undefined,
    endDate: draftData.endDate ? utils.formatContractDate(draftData?.endDate) : undefined,
  })
}

const destructDraftsArray = (object?: { id: string }[]) => {
  return (object || []).map((x) => x.id)
}

const updateDraft = async (draftData: DraftData, user: User): Promise<Draft> => {
  const draft = await Draft.find(draftData.id)

  if (!draft) throw new NotFoundException('Draft not found', 404, 'NOT_FOUND')

  draft.name = draftData?.name || draft.name
  draft.countryId = draftData?.countryId
  draft.governmentBehalf = isGovernmentBehalf(user, draftData?.governmentBehalf)
  draft.ltaId = draftData?.ltaId
  draft.currencyId = draftData?.currencyId
  draft.budget = draftData?.budget
  draft.frequencyId = draftData?.frequencyId
  draft.startDate = draftData.startDate
    ? utils.formatContractDate(draftData.startDate, true)
    : undefined
  draft.endDate = draftData.endDate ? utils.formatContractDate(draftData.endDate) : undefined
  draft.ispId = draftData?.ispId
  draft.createdBy = draftData?.createdBy
  draft.schools = draftData?.schools
  draft.expectedMetrics = draftData?.expectedMetrics

  return draft.save()
}

const deleteDraft = async (draftId: number) => {
  const trx = await Database.transaction()
  try {
    const draft = await Draft.find(draftId, { client: trx })
    if (!draft) throw new NotFoundException('Draft not found', 404, 'NOT_FOUND')

    await draft.useTransaction(trx).load('attachments')
    await draft.useTransaction(trx).related('attachments').detach()

    for (const attachment of draft.attachments) {
      await Attachment.find(attachment.id, { client: trx }).then((attach) =>
        attach?.useTransaction(trx).delete()
      )
    }

    await draft.useTransaction(trx).delete()

    return trx.commit()
  } catch (error) {
    await trx.rollback()
    if (error?.status === 404) throw error
    throw new FailedDependencyException(
      'Some dependency failed while uploading attachment',
      424,
      'FAILED_DEPENDENCY'
    )
  }
}

const isGovernmentBehalf = (user: User, governmentBehalf?: boolean) =>
  userService.checkUserRole(user, [roles.government]) ? true : governmentBehalf

export default {
  saveDraft,
  getDraft,
  updateDraft,
  deleteDraft,
}
