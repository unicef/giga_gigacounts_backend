import NotFoundException from 'App/Exceptions/NotFoundException'
// import Attachment from 'App/Models/Attachment'
import Draft from 'App/Models/Draft'
import Metric from 'App/Models/Metric'
import School from 'App/Models/School'

import dto from 'App/DTOs/Draft'

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

const saveDraft = async (draftData: Draft): Promise<Draft> => {
  return Draft.create(draftData)
}

const destructDraftsArray = (object?: { id: number }[]) => {
  return (object || []).map((x) => x.id)
}

const updateDraft = async (draftData: Draft): Promise<Draft> => {
  const draft = await Draft.find(draftData.id)

  if (!draft) throw new NotFoundException('Draft not found', 404, 'NOT_FOUND')

  draft.name = draftData?.name || draft.name
  draft.countryId = draftData?.countryId
  draft.governmentBehalf = draftData?.governmentBehalf
  draft.ltaId = draftData?.ltaId
  draft.currencyId = draftData?.currencyId
  draft.budget = draftData?.budget
  draft.frequencyId = draftData?.frequencyId
  draft.startDate = draftData?.startDate
  draft.endDate = draftData?.endDate
  draft.ispId = draftData?.ispId
  draft.createdBy = draftData?.createdBy
  draft.schools = draftData?.schools
  draft.expectedMetrics = draftData?.expectedMetrics

  return draft.save()
}

export default {
  saveDraft,
  getDraft,
  updateDraft,
}
