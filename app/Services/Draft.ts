import Database from '@ioc:Adonis/Lucid/Database'

import NotFoundException from 'App/Exceptions/NotFoundException'
import DatabaseException from 'App/Exceptions/DatabaseException'
import Draft from 'App/Models/Draft'
import Metric from 'App/Models/Metric'
import School from 'App/Models/School'
import Attachment from 'App/Models/Attachment'

import dto from 'App/DTOs/Draft'
import userService from 'App/Services/User'
import { roles } from 'App/Helpers/constants'
import User from 'App/Models/User'
import utils from 'App/Helpers/utils'
import InvalidStatusException from 'App/Exceptions/InvalidStatusException'

export interface DraftData {
  id: number
  name?: string
  countryId?: number
  governmentBehalf?: boolean
  automatic?: boolean
  ltaId?: number
  currencyId?: number
  budget?: number
  frequencyId?: number
  startDate?: string
  endDate?: string
  launchDate?: string
  ispId?: number
  createdBy?: number
  attachments?: { attachments: { id: number }[] }
  schools?: { schools: { external_id: string; budget: number }[] }
  expectedMetrics?: { metrics: { metricId: string; value: number }[] }
  notes?: string
  breakingRules?: string
  paymentReceiverId?: number
}

function getSchoolBudgetByExternalId(json, external_id) {
  const { schools } = json

  for (const school of schools) {
    if (school.external_id === external_id) {
      return school.budget
    }
  }
  return 0
}

const getDraft = async (draftId: number) => {
  const draft = await Draft.find(draftId)

  if (!draft) throw new NotFoundException('Draft not found')

  await draft.load('country')
  await draft.load('currency')
  await draft.load('frequency')
  await draft.load('isp')
  await draft.load('lta')
  await draft.load('user')
  await draft.load('attachments')
  await draft.load('ispContacts', (builder) => builder.preload('roles'))
  await draft.load('stakeholders', (builder) => builder.preload('roles'))
  await draft.load('paymentReceiver')

  const schoolsDest: any[] = destructDraftsArray(draft.schools?.schools)
  const schools = await School.query().whereIn('externalId', schoolsDest)

  schools.forEach((school) => {
    school.budget = getSchoolBudgetByExternalId(draft.schools, school.externalId)
  })

  const expectedMetrics: { name?: string; value: number; metricId: string }[] = []

  if (draft.expectedMetrics?.metrics) {
    await Promise.all(
      draft.expectedMetrics?.metrics.map(async (metric) => {
        const metricFound = await Metric.find(metric.metricId)
        expectedMetrics.push({
          name: metricFound?.name,
          value: metric.value,
          metricId: metric.metricId.toString()
        })
      })
    )
  }

  return dto.getDraftDTO({ draft, schools, expectedMetrics })
}

const saveDraft = async (draftData: DraftData, user: User): Promise<Draft> => {
  const client = await Database.transaction()
  try {
    const draft = await Draft.create({
      name: draftData.name,
      countryId: draftData.countryId,
      ltaId: draftData.ltaId,
      currencyId: draftData.currencyId,
      budget: draftData.budget,
      frequencyId: draftData.frequencyId,
      ispId: draftData.ispId,
      automatic: draftData.automatic,
      createdBy: draftData.createdBy,
      schools: draftData.schools,
      expectedMetrics: draftData.expectedMetrics,
      governmentBehalf: await isGovernmentBehalf(user, draftData.governmentBehalf),
      startDate: draftData.startDate
        ? utils.formatContractDate(draftData?.startDate, true)
        : undefined,
      endDate: draftData.endDate ? utils.formatContractDate(draftData?.endDate) : undefined,
      launchDate: draftData.launchDate
        ? utils.formatContractDate(draftData?.launchDate)
        : undefined,
      notes: draftData.notes,
      breakingRules: draftData.breakingRules,
      paymentReceiverId: draftData.paymentReceiverId || undefined
    })

    await client.commit()

    return draft
  } catch (error) {
    console.error(error)
    await client.rollback()
    if (error?.status === 404) throw error
    throw error
  }
}

const destructDraftsArray = (object?: { external_id: string }[]) => {
  return (object || []).map((x) => x.external_id)
}

const updateDraft = async (draftData: DraftData, user: User): Promise<Draft> => {
  const draft = await Draft.find(draftData.id)

  if (!draft) throw new NotFoundException('Draft not found')

  const client = await Database.transaction()
  try {
    draft.name = draftData?.name || draft.name
    draft.countryId = draftData?.countryId
    draft.governmentBehalf = await isGovernmentBehalf(user, draftData?.governmentBehalf)
    draft.ltaId = draftData?.ltaId
    draft.currencyId = draftData?.currencyId
    draft.budget = draftData?.budget
    draft.frequencyId = draftData?.frequencyId
    draft.startDate = draftData.startDate
      ? utils.formatContractDate(draftData.startDate, true)
      : undefined
    draft.endDate = draftData.endDate ? utils.formatContractDate(draftData.endDate) : undefined
    draft.launchDate = draftData.launchDate
      ? utils.formatContractDate(draftData.launchDate)
      : undefined
    draft.ispId = draftData?.ispId
    draft.createdBy = draftData?.createdBy
    draft.schools = draftData?.schools
    draft.expectedMetrics = draftData?.expectedMetrics
    draft.paymentReceiverId = draftData?.paymentReceiverId || undefined

    const savedDraft = await draft.save()
    await client.commit()

    return savedDraft
  } catch (error) {
    console.error(error)
    await client.rollback()
    if (error?.status === 404) throw error
    throw error
  }
}

const deleteDraft = async (draftId: number) => {
  const trx = await Database.transaction()
  try {
    const draft = await Draft.find(draftId, { client: trx })
    if (!draft) throw new NotFoundException('Draft not found')

    await draft.useTransaction(trx).load('attachments')
    await draft.useTransaction(trx).related('attachments').detach()

    for (const attachment of draft.attachments) {
      await Attachment.find(attachment.id, { client: trx }).then((attach) =>
        attach?.useTransaction(trx).delete()
      )
    }

    await draft.useTransaction(trx).load('ispContacts')
    await draft.useTransaction(trx).related('ispContacts').detach()

    await draft.useTransaction(trx).load('stakeholders')
    await draft.useTransaction(trx).related('stakeholders').detach()

    await draft.useTransaction(trx).delete()

    return trx.commit()
  } catch (error) {
    await trx.rollback()
    if (error?.status === 404) throw error
    throw new DatabaseException('Some database error occurred while delete Drafts')
  }
}

const duplicateDraft = async (draftId, user: User) => {
  const client = await Database.transaction()
  try {
    const draft = await Draft.find(draftId)
    if (!draft) throw new NotFoundException('Draft not found')

    if (
      (await userService.checkUserRole(user, [
        roles.ispContractManager,
        roles.countryContractCreator,
        roles.countrySuperAdmin
      ])) &&
      user.countryId !== draft.countryId
    )
      throw new InvalidStatusException(
        'The current user does not have the required permissions to duplicate the draft.',
        401,
        'E_UNAUTHORIZED_ACCESS'
      )

    let draftName = draft.name
    var regex = /(\d+)/g

    const draftNames = await Draft.query().whereILike('name', `%${draftName}%`)

    if (draftNames.length >= 1) {
      let clauseValidation = draftNames.slice(-1)[0].name.match(regex)
      if ((clauseValidation?.length as number) > 1) {
        let newNumber = Number(draftNames.slice(-1)[0].name.split(' ').slice(-1)) + 1

        draftName = `${draft.name} - Copy ${newNumber}`
      } else {
        draftName = `${draft.name} - Copy 1`
      }
    } else {
      draftName = `${draft.name} - Copy`
    }

    const newDraft = await Draft.create({
      name: draftName,
      countryId: draft.countryId,
      ltaId: draft.ltaId,
      currencyId: draft.currencyId,
      budget: draft.budget,
      frequencyId: draft.frequencyId,
      ispId: draft.ispId,
      automatic: draft.automatic,
      createdBy: draft.createdBy,
      schools: draft.schools,
      expectedMetrics: draft.expectedMetrics,
      governmentBehalf: await isGovernmentBehalf(user, draft.governmentBehalf),
      startDate: draft.startDate,
      endDate: draft.endDate,
      launchDate: draft.launchDate,
      notes: draft.notes,
      breakingRules: draft.breakingRules
    })

    await client.commit()

    return newDraft
  } catch (error) {
    console.error(error)
    await client.rollback()
    if (error?.status === 404) throw error
    throw error
  }
}

const isGovernmentBehalf = async (user: User, governmentBehalf?: boolean) =>
  (await userService.checkUserRole(user, [roles.gigaAdmin])) ? true : governmentBehalf

export default {
  saveDraft,
  getDraft,
  updateDraft,
  deleteDraft,
  duplicateDraft,
  isGovernmentBehalf
}
