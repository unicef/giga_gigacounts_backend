import Frequency from 'App/Models/Frequency'

export const createFrequencies = () => {
  return Promise.all([
    Frequency.firstOrCreate({ name: 'Monthly' }),
    Frequency.firstOrCreate({ name: 'Daily' }),
  ])
}
