import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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

  public async createContract({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const data = request.all() as ContractCreation
      const contract = await service.createContract(data, auth.user)
      return response.ok(contract)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async saveDraft({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const draftData = request.all() as DraftData
      const draft = await draftService.saveDraft(draftData, auth.user)
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

  public async updateDraft({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const draftData = request.all() as DraftData
      const draft = await draftService.updateDraft(draftData, auth.user)
      response.ok(draft)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async contractList({ request, response, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const { status } = request.qs()
      const parsedStatus = isNaN(parseInt(status)) ? undefined : parseInt(status)
      const contracts = await service.getContractList(auth.user, parsedStatus)
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

  public async publishContract({ response, request, auth }: HttpContextContract) {
    try {
      const { contract_id } = request.all()
      const contract = await service.publishContract(contract_id, auth.user?.id)
      response.ok(contract)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async approveContract({ response, request, auth }: HttpContextContract) {
    try {
      const { contract_id } = request.all()
      const contract = await service.approveContract(contract_id, auth.user?.id)
      response.ok(contract)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async getContractDetails({ response, request }: HttpContextContract) {
    try {
      const { contract_id } = request.params()
      const contract = await service.getContractDetails(contract_id)
      response.ok(contract)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async getContractSchools({ response, request }: HttpContextContract) {
    try {
      const { contract_id } = request.params()
      const contract = await service.getContractSchools(contract_id)
      response.ok(contract)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async getContractSchoolConnectivity({ response, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const contract = await service.getContractSchoolConnectivity(auth.user)
      response.ok(contract)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async getContract({ response, request }: HttpContextContract) {
    try {
      const { contract_id } = request.params()
      const contract = await service.getContract(contract_id)
      response.ok(contract)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async contractStatusBatchUpdate({ response, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const contracts = await service.contractStatusBatchUpdate(auth.user)
      response.ok(contracts)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async loadContractsDailyMeasures({ response }: HttpContextContract) {
    try {
      await service.loadContractsDailyMeasures()
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async deleteDraft({ response, request }: HttpContextContract) {
    try {
      const { draft_id } = request.params()
      const result = await draftService.deleteDraft(draft_id)
      response.ok(result)
    } catch (error) {
      return response.status(error?.status || error.statusCode).send(error.message)
    }
  }

  public async getContractAvailablePayments({ response, request }: HttpContextContract) {
    try {
      const { contract_id } = request.params()
      const result = await service.getContractAvailablePayments(contract_id)
      response.ok(result)
    } catch (error) {
      return response.status(error?.status || error.statusCode).send(error.message)
    }
  }

  public async duplicateContract({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const { contract_id } = request.params()
      const result = await service.duplicateContract(contract_id, auth.user)

      response.ok({
        ok: true,
        draftId: result?.id,
        name: result?.name,
        message: 'Contract duplicated, saved it in Drafts.'
      })
    } catch (error) {
      return response.status(error?.status || error.statusCode).send(error.message)
    }
  }

  public async duplicateDraft({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const { draft_id } = request.params()
      const result = await draftService.duplicateDraft(draft_id, auth.user)

      response.ok({
        ok: true,
        draftId: result?.id,
        name: result?.name,
        message: 'Draft duplicated.'
      })
    } catch (error) {
      return response.status(error?.status || error.statusCode).send(error.message)
    }
  }
  public async generateSignContractRandomString({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const { contract_id } = request.all()
      const randomString = await service.generateSignContractRandomString(contract_id)
      return response.ok(randomString)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }

  public async signContractWithWallet({ response, request, auth }: HttpContextContract) {
    try {
      if (!auth.user) return
      const { contract_id, address, signatureHash } = request.all()
      const result = await service.signContractWithWallet(
        contract_id,
        address,
        signatureHash,
        auth.user
      )
      return response.ok(result)
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}
