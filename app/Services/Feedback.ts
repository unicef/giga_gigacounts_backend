import { RequestContract } from '@ioc:Adonis/Core/Request'
import User from 'App/Models/User'
import DatabaseException from 'App/Exceptions/DatabaseException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Feedback from 'App/Models/Feedback'
import notificationService from 'App/Services/Notifications'
import Database from '@ioc:Adonis/Lucid/Database'
import userService from 'App/Services/User'
import { roles } from 'App/Helpers/constants'

const listFeedbacks = async (user: User) => {
  try {
    if (!(await userService.checkUserRole(user, [roles.gigaAdmin]))) {
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
      throw new DatabaseException('Some database error occurred while find Feedbacks')
    } else if (error.status === 401) {
      throw new DatabaseException(
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
    const data = await Feedback.create({
      rate,
      comment
    })

    await notificationService.createFeedbackNotifications(data, user)

    await client.commit()
    return data
  } catch (error) {
    if (error.status === 404) throw error
    throw new DatabaseException('Some database error occurred while creating Feedback')
  }
}

export default {
  listFeedbacks,
  createFeedback
}
