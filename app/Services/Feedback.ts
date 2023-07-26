import { RequestContract } from '@ioc:Adonis/Core/Request'
import User from 'App/Models/User'
import FailedDependencyException from 'App/Exceptions/FailedDependencyException'
import NotFoundException from 'App/Exceptions/NotFoundException'

import Feedback from 'App/Models/Feedback'
import notificationService from 'App/Services/Notifications'
import Database from '@ioc:Adonis/Lucid/Database'
import userService from 'App/Services/User'
import { roles } from 'App/Helpers/constants'

const listFeedbacks = async (user: User) => {
  try {
    if (!userService.checkUserRole(user, [roles.gigaAdmin])) {
      throw new NotFoundException(
        'You do not have the permissions to get the feedback list',
        401,
        'UNAUTHORIZED'
      )
    }
    const query = Feedback.query()
    return query as unknown as Feedback[]
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

const createFeedback = async (user: User, req: RequestContract): Promise<Feedback> => {
  const client = await Database.transaction()
  try {
    const { rate, comment } = req.body()

    const helprequests = await Feedback.create({
      rate,
      comment
    })

    await notificationService.createFeedbackNotification('FDBACK', helprequests, user)

    await client.commit()
    return helprequests
  } catch (error) {
    if (error.status === 404) throw error
    throw new FailedDependencyException(
      'Some database error occurred while creating Feedback',
      424,
      'DATABASE_ERROR'
    )
  }
}

export default {
  listFeedbacks,
  createFeedback
}
