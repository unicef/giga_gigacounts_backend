import Safe from 'App/Models/Safe'

import gnosisSafe from 'App/Helpers/gnosisSafe'

export const execute = async (name: string) => {
  const safeAddress = await gnosisSafe.deploySafe({ owners: [] })
  return Safe.create({ address: safeAddress, name })
}
