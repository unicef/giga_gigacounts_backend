import NotFoundException from 'App/Exceptions/NotFoundException'
import Draft from 'App/Models/Draft'

const saveDraft = async (draftData: Draft): Promise<Draft> => {
  return Draft.create(draftData)
}

const updateDraft = async (draftData: Draft): Promise<Draft> => {
  const draft = await Draft.find(draftData.id)

  if (!draft) throw new NotFoundException('Draft not found', 404, 'NOT_FOUND')

  draft.name = draftData.name
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
  draft.attachments = draftData?.attachments
  draft.schools = draftData?.schools
  draft.expectedMetrics = draftData?.expectedMetrics

  return draft.save()
}

export default {
  saveDraft,
  updateDraft,
}
