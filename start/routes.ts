import Route from '@ioc:Adonis/Core/Route'

import { permissions } from 'App/Helpers/constants'

/**
 * USER ROUTES
 */

Route.get('/user/profile', 'UsersController.profile').middleware('auth:api')
Route.post('/login', 'UsersController.login').middleware('validator:LoginValidator')

/**
 * PAYMENT ROUTES
 */

Route.get('/payment/frequencies', 'PaymentsController.listFrequencies')

/**
 * ISP ROUTES
 */

Route.get('/isp', 'IspsController.listIsps').middleware(['auth:api', `acl:${permissions.ispRead}`])

/**
 * METRIC ROUTES
 */

Route.get('/metric/suggested-values', 'MetricsController.listMetricsSuggestedValues').middleware([
  'auth:api',
  `acl:${permissions.metricRead}`,
])

/**
 * SCHOOL ROUTES
 */

Route.get('/school', 'SchoolsController.listSchoolByCountry').middleware([
  'auth:api',
  `acl:${permissions.schoolRead}`,
])

Route.post('/school/measures', 'SchoolsController.getSchoolsMeasures').middleware([
  'auth:api',
  'validator:SchoolMeasuresValidator',
  `acl:${permissions.schoolRead}`,
])

/**
 * CURRENCY ROUTES
 */

Route.get('/currency', 'CurrenciesController.listCurrencies').middleware('auth:api')

/**
 * COUNTRY ROUTES
 */

Route.get('/country', 'CountriesController.listCountries').middleware('auth:api')

/**
 * CONTRACT ROUTES
 */

Route.get('/contract/count/status', 'ContractsController.countByStatus').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`,
])

Route.post('/contract', 'ContractsController.createContract').middleware([
  'auth:api',
  'validator:CreateContractValidator',
  `acl:${permissions.contractWrite}`,
])

Route.post('/contract/draft', 'ContractsController.saveDraft').middleware([
  'auth:api',
  'validator:SaveDraftValidator',
  `acl:${permissions.contractWrite}`,
])

Route.get('/contract/draft/:draft_id', 'ContractsController.getDraft').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`,
])

Route.put('/contract/draft', 'ContractsController.updateDraft').middleware([
  'auth:api',
  'validator:UpdateDraftValidator',
  `acl:${permissions.contractWrite}`,
])

Route.get('/contract', 'ContractsController.contractList').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`,
])

Route.post('/contract/change-status', 'ContractsController.changeStatus').middleware([
  'auth:api',
  'validator:ChangeStatusValidator',
  `acl:${permissions.contractWrite}`,
])

Route.get('/contract/details/:contract_id', 'ContractsController.getContractDetails').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`,
])

Route.get('/contract/schools/:contract_id', 'ContractsController.getContractSchools').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`,
])

Route.get('/contract/:contract_id', 'ContractsController.getContract').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`,
])

Route.patch('/contract/batch', 'ContractsController.contractStatusBatchUpdate').middleware([
  'auth:api',
  `acl:${permissions.contractWrite}`,
])

Route.get('/contract/daily/measures', 'ContractsController.loadContractsDailyMeasures').middleware([
  'auth:api',
  `acl:${permissions.contractWrite}`,
])

Route.delete('/contract/draft/:draft_id', 'ContractsController.deleteDraft').middleware([
  'auth:api',
  `acl:${permissions.contractWrite}`,
])

/**
 * ATTACHMENTS ROUTES
 */

Route.post('/attachments/upload', 'AttachmentsController.upload').middleware([
  'auth:api',
  'validator:UploadFileValidator',
  `acl:${permissions.attachmentWrite}`,
])

Route.delete('/attachments/:attachmentId', 'AttachmentsController.deleteAttachment').middleware([
  'auth:api',
  `acl:${permissions.attachmentWrite}`,
])

Route.get('/attachments/:attachment_id', 'AttachmentsController.getAttachment').middleware([
  'auth:api',
  `acl:${permissions.attachmentRead}`,
])

/**
 * LTAS ROUTES
 */

Route.get('/lta', 'LtasController.listLtas').middleware(['auth:api', `acl:${permissions.ltaRead}`])

/**
 * MEASURE ROUTES
 */

Route.post('/measure/calculate', 'MeasuresController.calculateMeasuresByMonthYear').middleware([
  'auth:api',
  'validator:CalculateMeasuresValidator',
  `acl:${permissions.measureRead}`,
])

/**
 * TESTING PURPOSE ONLY ROUTES
 */

Route.get('/test/one-permission', ({ response }) => {
  response.send({ message: 'Authorized!' })
}).middleware(['auth:api', 'acl:test1.read'])

Route.get('/test/two-permission', ({ response }) => {
  response.send({ message: 'Authorized!' })
}).middleware(['auth:api', 'acl:test1.read,test2.read'])
