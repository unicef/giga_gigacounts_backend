import service from 'App/Services/Safe'

export const execute = async (email?: string) => {
  return service.addUsersToSafe(email)
}
