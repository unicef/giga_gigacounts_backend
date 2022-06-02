import Frequency from 'App/Models/Frequency'

const listFrequencies = async (): Promise<Frequency[]> => {
  return Frequency.all()
}

export default {
  listFrequencies,
}
