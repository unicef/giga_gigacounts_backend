import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Draft from 'App/Models/Draft'

import service, { ContractCreation } from 'App/Services/Contract'
import draftService, { DraftData } from 'App/Services/Draft'

export default class ContractsController {
  public async countByStatus({ response, auth }: HttpContextContract) {
    try {
      const count = await service.getContractsCountByStatus(auth.user)
      return response.ok(count)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async createContract({ response, request }: HttpContextContract) {
    try {
      const data = request.all() as ContractCreation
      const contract = await service.createContract(data)
      return response.ok(contract)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async saveDraft({ response, request }: HttpContextContract) {
    try {
      const draftData = request.all() as Draft
      const draft = await draftService.saveDraft(draftData)
      response.ok(draft)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async getDraft({ response, request }: HttpContextContract) {
    try {
      const { draft_id } = request.params()
      const draft = await draftService.getDraft(draft_id)
      response.ok(draft)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async updateDraft({ response, request }: HttpContextContract) {
    try {
      const draftData = request.all() as DraftData
      const draft = await draftService.updateDraft(draftData)
      response.ok(draft)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async contractList({ response, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const contracts = await service.getContractList(auth.user)
      return response.ok(contracts)
    } catch (error) {
      if (!error.status) return response.internalServerError(error.message)
    }
  }

  public async changeStatus({ response, request, auth }: HttpContextContract) {
    try {
      const { contract_id, status } = request.all()
      const contract = await service.changeStatus(contract_id, status, auth.user?.id)
      response.ok(contract)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
