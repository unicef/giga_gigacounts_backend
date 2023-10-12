import Frequency from 'App/Models/Frequency'

const listFrequency = async (): Promise<Frequency[]> => {
  const query = Frequency.query().select('id', 'name')
  return query
}

export default {
  listFrequency
}
