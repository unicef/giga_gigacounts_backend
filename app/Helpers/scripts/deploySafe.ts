import service from 'App/Services/Safe'

export const execute = async (name: string) => {
  return service.createSafe(name)
}
