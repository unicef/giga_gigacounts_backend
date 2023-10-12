import { RequestContract } from '@ioc:Adonis/Core/Request'
import HelpRequest from 'App/Models/HelpRequest'
import notificationService from 'App/Services/NotificationService'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import DatabaseException from 'App/Exceptions/DatabaseException'
import HelpRequestValue from 'App/Models/HelpRequestValue'
import dto from 'App/DTOs/HelpRequestValue'

const listHelpRequests = async () => {
  try {
    const query = HelpRequest.query()
    return query as unknown as HelpRequest[]
  } catch (error) {
    if (error.status === 404) throw error
    throw new DatabaseException('Some database error occurred while find help-requests')
  }
}

const listHelpRequestValues = async () => {
  try {
    const query = (await HelpRequestValue.query()) as HelpRequestValue[]
    return dto.listHelpRequestValueDto(query)
  } catch (error) {
    if (error.status === 404) throw error
    throw new DatabaseException('Some database error occurred while find help-requests-values')
  }
}

const createHelpRequest = async (user: User, req: RequestContract): Promise<HelpRequest> => {
  const client = await Database.transaction()
  try {
    const { type, description, path } = req.body()
    const userId = user.id

    const data = await HelpRequest.create({
      type,
      description,
      path,
      userId
    })

    await notificationService.createHelpRequestNotifications(data, user)
    await client.commit()
    return data
  } catch (error) {
    if (error.status === 404) throw error
    throw new DatabaseException('Some database error occurred while creating help request')
  }
}

export default {
  listHelpRequests,
  createHelpRequest,
  listHelpRequestValues
}
