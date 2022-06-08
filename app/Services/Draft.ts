import Draft from 'App/Models/Draft'

const saveDraft = async (draftData: Draft): Promise<Draft> => {
  return Draft.create(draftData)
}

export default {
  saveDraft,
}
