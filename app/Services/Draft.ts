import Database from '@ioc:Adonis/Lucid/Database'

import NotFoundException from 'App/Exceptions/NotFoundException'
import FailedDependencyException from 'App/Exceptions/FailedDependencyException'
import Draft from 'App/Models/Draft'
import Metric from 'App/Models/Metric'
import School from 'App/Models/School'
import Attachment from 'App/Models/Attachment'
import { DateTime } from 'luxon'

import dto from 'App/DTOs/Draft'

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
  schools?: { schools: { id: number }[] }
  expectedMetrics?: { metrics: { metricId: number; value: number }[] }
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

  const expectedMetrics: { name?: string; value: number }[] = []

  if (draft.expectedMetrics?.metrics) {
    await Promise.all(
      draft.expectedMetrics?.metrics.map(async (metric) => {
        const metricFound = await Metric.find(metric.metricId)
        expectedMetrics.push({ name: metricFound?.name, value: metric.value })
      })
    )
  }

  return dto.getDraftDTO({ draft, schools, expectedMetrics })
}

const saveDraft = async (draftData: DraftData): Promise<Draft> => {
  return Draft.create({
    ...draftData,
    startDate: draftData.startDate
      ? DateTime.fromFormat(draftData?.startDate, 'yyyy-MM-dd').set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        })
      : undefined,
    endDate: draftData.endDate
      ? DateTime.fromFormat(draftData?.endDate, 'yyyy-MM-dd').set({
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 0,
        })
      : undefined,
  })
}

const destructDraftsArray = (object?: { id: number }[]) => {
  return (object || []).map((x) => x.id)
}

const updateDraft = async (draftData: DraftData): Promise<Draft> => {
  const draft = await Draft.find(draftData.id)

  if (!draft) throw new NotFoundException('Draft not found', 404, 'NOT_FOUND')

  draft.name = draftData?.name || draft.name
  draft.countryId = draftData?.countryId
  draft.governmentBehalf = draftData?.governmentBehalf
  draft.ltaId = draftData?.ltaId
  draft.currencyId = draftData?.currencyId
  draft.budget = draftData?.budget
  draft.frequencyId = draftData?.frequencyId
  draft.startDate = draftData.startDate
    ? DateTime.fromFormat(draftData.startDate, 'yyyy-MM-dd').set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
    : undefined
  draft.endDate = draftData.endDate
    ? DateTime.fromFormat(draftData.endDate, 'yyyy-MM-dd').set({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 0,
      })
    : undefined
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

export default {
  saveDraft,
  getDraft,
  updateDraft,
  deleteDraft,
}
