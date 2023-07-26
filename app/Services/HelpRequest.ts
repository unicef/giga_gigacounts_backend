import { RequestContract } from '@ioc:Adonis/Core/Request'
import HelpRequest from 'App/Models/HelpRequest'
import userService from 'App/Services/User'
import notificationService from 'App/Services/Notifications'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import FailedDependencyException from 'App/Exceptions/FailedDependencyException'
import NotFoundException from 'App/Exceptions/NotFoundException'

import { roles } from 'App/Helpers/constants'
import HelpRequestValue from 'App/Models/HelpRequestValue'
import Functionality from 'App/Models/Functionality'

const listHelpRequests = async (user: User) => {
  try {
    const query = HelpRequest.query()
    if (!userService.checkUserRole(user, [roles.gigaAdmin])) {
      throw new NotFoundException(
        'You do not have the permissions to get the feedback list',
        401,
        'UNAUTHORIZED'
      )
    }
    return query as unknown as HelpRequest[]
  } catch (error) {
    if (error.status === 404) {
      throw new FailedDependencyException(
        'Some database error occurred while find Feedbacks',
        424,
        'DATABASE_ERROR'
      )
    } else if (error.status === 401) {
      throw new FailedDependencyException(
        'You do not have the permissions to get the feedback list',
        401,
        'UNAUTHORIZED'
      )
    }
  }
}

const createHelpRequest = async (user: User, req: RequestContract): Promise<HelpRequest> => {
  const client = await Database.transaction()
  try {
    const { code, functionality, type, description } = req.body()
    const userId = user.id

    const helprequests = await HelpRequest.create({
      code,
      functionality,
      type,
      description,
      userId
    })

    await notificationService.createHelpRequestNotification('FDBACK', helprequests, user)

    await client.commit()
    return helprequests
  } catch (error) {
    if (error.status === 404) throw error
    throw new FailedDependencyException(
      'Some database error occurred while creating help request',
      424,
      'DATABASE_ERROR'
    )
  }
}

const listHelpRequestValues = async (): Promise<HelpRequestValue[]> => {
  try {
    const query = HelpRequestValue.query()
    if (!query) throw new NotFoundException('Functionalities not found', 404, 'NOT_FOUND')
    return query as unknown as HelpRequestValue[]
  } catch (error) {
    if (error.status === 404) throw error
    throw new FailedDependencyException(
      'Some database error occurred while find help request values',
      424,
      'DATABASE_ERROR'
    )
  }
}

const listFunctionalities = async (): Promise<Functionality[]> => {
  try {
    const query = Functionality.query()
    if (!query) throw new NotFoundException('Functionalities not found', 404, 'NOT_FOUND')
    return query as unknown as Functionality[]
  } catch (error) {
    if (error.status === 404) throw error
    throw new FailedDependencyException(
      'Some database error occurred while finding functionalities',
      424,
      'DATABASE_ERROR'
    )
  }
}

export default {
  listHelpRequests,
  createHelpRequest,
  listHelpRequestValues,
  listFunctionalities
}
