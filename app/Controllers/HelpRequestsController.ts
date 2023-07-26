import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import service from 'App/Services/HelpRequest'

export default class HelpRequestsController {
  public async listHelpRequests({ response, auth }: HttpContextContract) {
    if (!auth.user) return
    const feedbacks = await service.listHelpRequests(auth.user)
    return response.ok(feedbacks)
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

  public async listHelpRequestValues({ response, auth }: HttpContextContract) {
    if (!auth.user) return
    const feedbackValues = await service.listHelpRequestValues()
    return response.ok(feedbackValues)
  }

  public async listFunctionalities({ response, auth }: HttpContextContract) {
    if (!auth.user) return
    const functionalities = await service.listFunctionalities()
    return response.ok(functionalities)
  }
}
