import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/HelpRequestService'

export default class HelpRequestsController {
  public async listHelpRequests({ response, auth }: HttpContextContract) {
    if (!auth.user) return
    const feedbacks = await service.listHelpRequests()
    return response.ok(feedbacks)
  }

  public async listHelpRequestValues({ response, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const feedbackValues = await service.listHelpRequestValues()
      return response.ok(feedbackValues)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async createHelpRequest({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const feedback = await service.createHelpRequest(auth.user, request)
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
