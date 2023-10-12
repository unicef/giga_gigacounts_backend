import { RequestContract } from '@ioc:Adonis/Core/Request'
import User from 'App/Models/User'
import DatabaseException from 'App/Exceptions/DatabaseException'
import Feedback from 'App/Models/Feedback'
import notificationService from 'App/Services/NotificationService'
import Database from '@ioc:Adonis/Lucid/Database'

const listFeedbacks = async () => {
  try {
    const query = Feedback.query()
    return query as unknown as Feedback[]
  } catch (error) {
    if (error.status === 404) throw error
    throw new DatabaseException('Some database error occurred while find Feedbacks')
  }
}

const createFeedback = async (user: User, req: RequestContract): Promise<Feedback> => {
  const client = await Database.transaction()
  try {
    const { rate, comment, path } = req.body()
    const data = await Feedback.create({
      rate,
      comment,
      path
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
