import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/FeedbackService'

export default class FeedbacksController {
  public async listFeedbacks({ response, auth }: HttpContextContract) {
    if (!auth.user) return
    const feedbacks = await service.listFeedbacks()
    return response.ok(feedbacks)
  }

  public async createFeedback({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return

      const feedback = await service.createFeedback(auth.user, request)

      return response.ok({
        ok: true,
        feedbackId: feedback.id,
        message: 'HelpRequest successfully created'
      })
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
