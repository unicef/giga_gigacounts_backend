import Setting from 'App/Models/Setting'

const getSettings = async (keys: Array<string>): Promise<Setting[]> => {
  const query = Setting.query()

  if (keys.length > 0) {
    query.whereIn('key', keys)
  }

  return (await query) as Setting[]
}

const getSettingValue = async (key: string): Promise<string> => {
  const result = await getSettings([key.toLowerCase()])
  return result.length > 0 ? result[0].value : ''
}

export default {
  getSettings,
  getSettingValue
}
