import HelpRequestValue from 'App/Models/HelpRequestValue'

export interface HelpRequestValueData {
  id: string
  code: string
  option: string
}

const listHelpRequestValueDto = async (
  helpRequestValues: HelpRequestValue[]
): Promise<HelpRequestValueData[]> => {
  return Promise.all(
    helpRequestValues.map(async (item) => {
      return {
        id: item.id.toString(),
        code: item.code,
        option: item.option
      }
    })
  )
}

export default {
  listHelpRequestValueDto
}
