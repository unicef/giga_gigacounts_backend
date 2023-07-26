import Route from '@ioc:Adonis/Core/Route'

import { permissions } from 'App/Helpers/constants'

/**
 * USER ROUTES
 */

Route.get('/user/profile', 'UsersController.profile').middleware('auth:jwt')

Route.post('/login', 'UsersController.login').middleware('validator:LoginValidator')

Route.get('/wallet-random-string', 'UsersController.generateWalletRandomString').middleware([
  'auth:jwt',
  `acl:${permissions.walletWrite}`
])

Route.post('/user/attach-wallet', 'UsersController.attachWallet').middleware([
  'auth:jwt',
  'validator:AttachWalletValidator'
])

Route.post('/user/permissions', 'UsersController.getPermissionsByEmail')

Route.patch(
  '/user/setting-automatic-contract',
  'UsersController.updateSettingAutomaticContracts'
).middleware([
  'auth:jwt',
  `acl:${permissions.walletWrite}`,
  'validator:updateSettingAutomaticContractsValidator'
])

/**
 * PAYMENT ROUTES
 */

Route.get('/payment', 'PaymentsController.getPayments').middleware([
  'auth:jwt',
  `acl:${permissions.paymentRead}:${permissions.contractRead}`
])

Route.get('/payment/frequencies', 'PaymentsController.listFrequencies')

Route.post('/payment', 'PaymentsController.createPayment').middleware([
  'auth:jwt',
  'validator:CreatePaymentValidator',
  `acl:${permissions.paymentWrite}`
])

Route.get('/payment/contract/:contract_id', 'PaymentsController.getPaymentsByContract').middleware([
  'auth:jwt',
  `acl:${permissions.paymentRead}:${permissions.contractRead}`
])

Route.get('/payment/:payment_id', 'PaymentsController.getPayment').middleware([
  'auth:jwt',
  `acl:${permissions.paymentRead}`
])

Route.post('/payment/change-status', 'PaymentsController.changePaymentStatus').middleware([
  'auth:jwt',
  'validator:ChangePaymentStatusValidator',
  `acl:${permissions.paymentWrite}`
])

Route.put('/payment', 'PaymentsController.updatePayment').middleware([
  'auth:jwt',
  'validator:UpdatePaymentValidator',
  `acl:${permissions.paymentWrite}`
])

/**
 * ISP ROUTES
 */

Route.get('/isp', 'IspsController.listIsps').middleware(['auth:jwt', `acl:${permissions.ispRead}`])

/**
 * METRIC ROUTES
 */

Route.get('/metric/suggested-values', 'MetricsController.listMetricsSuggestedValues').middleware([
  'auth:jwt',
  `acl:${permissions.metricRead}`
])

/**
 * SCHOOL ROUTES
 */

Route.get('/school', 'SchoolsController.listSchoolByCountry').middleware([
  'auth:jwt',
  `acl:${permissions.schoolRead}`
])

Route.patch('/school', 'SchoolsController.updateSchoolReliableMeasures').middleware([
  'auth:jwt',
  `acl:${permissions.schoolWrite}`
])

Route.post('/school/measures', 'SchoolsController.getSchoolsMeasures').middleware([
  'auth:jwt',
  'validator:SchoolMeasuresValidator',
  `acl:${permissions.schoolRead}`
])

/**
 * CURRENCY ROUTES
 */

Route.get('/currency', 'CurrenciesController.listCurrencies').middleware('auth:jwt')

/**
 * COUNTRY ROUTES
 */

Route.get('/country', 'CountriesController.listCountries').middleware('auth:jwt')

/**
 * CONTRACT ROUTES
 */

Route.get('/contract/count/status', 'ContractsController.countByStatus').middleware([
  'auth:jwt',
  `acl:${permissions.contractRead}`
])

Route.post('/contract', 'ContractsController.createContract').middleware([
  'auth:jwt',
  'validator:CreateContractValidator',
  `acl:${permissions.contractWrite}`
])

Route.post('/contract/draft', 'ContractsController.saveDraft').middleware([
  'auth:jwt',
  'validator:SaveDraftValidator',
  `acl:${permissions.contractWrite}`
])

Route.get('/contract/draft/:draft_id', 'ContractsController.getDraft').middleware([
  'auth:jwt',
  `acl:${permissions.contractRead}`
])

Route.put('/contract/draft', 'ContractsController.updateDraft').middleware([
  'auth:jwt',
  'validator:UpdateDraftValidator',
  `acl:${permissions.contractWrite}`
])

Route.get('/contract', 'ContractsController.contractList').middleware([
  'auth:jwt',
  `acl:${permissions.contractRead}`
])

Route.post('/contract/change-status', 'ContractsController.changeStatus').middleware([
  'auth:jwt',
  'validator:ChangeStatusValidator',
  `acl:${permissions.contractWrite}`
])

Route.post('/contract/publish', 'ContractsController.publishContract').middleware([
  'auth:jwt',
  'validator:publishContractValidator',
  `acl:${permissions.contractWrite}`
])

Route.post('/contract/approve', 'ContractsController.approveContract').middleware([
  'auth:jwt',
  'validator:approveContractValidator',
  `acl:${permissions.contractWrite}`
])

Route.get('/contract/details/:contract_id', 'ContractsController.getContractDetails').middleware([
  'auth:jwt',
  `acl:${permissions.contractRead}`
])

Route.get('/contract/schools/:contract_id', 'ContractsController.getContractSchools').middleware([
  'auth:jwt',
  `acl:${permissions.contractRead}`
])

Route.get(
  '/contract/school/connectivity',
  'ContractsController.getContractSchoolConnectivity'
).middleware(['auth:jwt', `acl:${permissions.contractRead}`])

Route.get('/contract/:contract_id', 'ContractsController.getContract').middleware([
  'auth:jwt',
  `acl:${permissions.contractRead}`
])

Route.patch('/contract/batch', 'ContractsController.contractStatusBatchUpdate').middleware([
  'auth:jwt',
  `acl:${permissions.contractWrite}`
])

Route.get('/contract/daily/measures', 'ContractsController.loadContractsDailyMeasures').middleware([
  'auth:jwt',
  `acl:${permissions.contractWrite}`
])

Route.delete('/contract/draft/:draft_id', 'ContractsController.deleteDraft').middleware([
  'auth:jwt',
  `acl:${permissions.contractWrite}`
])

Route.get(
  '/contract/available-payments/:contract_id',
  'ContractsController.getContractAvailablePayments'
).middleware(['auth:jwt', `acl:${permissions.contractRead}:${permissions.paymentRead}`])

Route.post('/contract/duplicate/:contract_id', 'ContractsController.duplicateContract').middleware([
  'auth:jwt',
  `acl:${permissions.contractWrite}`
])

Route.post('/contract/draft/duplicate/:draft_id', 'ContractsController.duplicateDraft').middleware([
  'auth:jwt',
  `acl:${permissions.contractWrite}`
])

Route.post(
  '/contract/generate-sign-random-string',
  'ContractsController.generateSignContractRandomString'
).middleware([
  'auth:jwt',
  'validator:GenerateSignContractRandomStringValidator',
  `acl:${permissions.contractSignWithWallet}`
])

Route.post('/contract/sign-with-wallet', 'ContractsController.signContractWithWallet').middleware([
  'auth:jwt',
  'validator:SignContractWithWalletValidator',
  `acl:${permissions.contractSignWithWallet}`
])

/**
 * ATTACHMENTS ROUTES
 */

Route.post('/attachments/upload', 'AttachmentsController.upload').middleware([
  'auth:jwt',
  'validator:UploadFileValidator',
  `acl:${permissions.attachmentWrite}`
])

Route.delete('/attachments/:attachmentId', 'AttachmentsController.deleteAttachment').middleware([
  'auth:jwt',
  `acl:${permissions.attachmentWrite}`
])

Route.get('/attachments/:attachment_id', 'AttachmentsController.getAttachment').middleware([
  'auth:jwt',
  `acl:${permissions.attachmentRead}`
])

/**
 * LTAS ROUTES
 */

Route.get('/lta', 'LtasController.listLtas').middleware(['auth:jwt', `acl:${permissions.ltaRead}`])

/**
 * MEASURE ROUTES
 */

Route.post('/measure/calculate', 'MeasuresController.calculateMeasuresByMonthYear').middleware([
  'auth:jwt',
  'validator:CalculateMeasuresValidator',
  `acl:${permissions.measureRead}`
])

/**
 * NOTIFICATIONS
 */

Route.get('/notifications', 'NotificationController.getNotifications').middleware(['auth:jwt'])

Route.get(
  '/user/:userId/notifications/',
  'NotificationController.getNotificationsByUserId'
).middleware(['auth:jwt'])

Route.get(
  '/user/:userId/notifications/:notificationId',
  'NotificationController.getNotificationById'
).middleware(['auth:jwt'])

Route.patch(
  '/user/:userId/notifications/:notificationId/read',
  'NotificationController.markAsReadNotificationsById'
).middleware(['auth:jwt'])

Route.patch(
  '/user/:userId/notifications/:notificationId/discard',
  'NotificationController.markAsDiscardedNotificationsById'
).middleware(['auth:jwt'])

Route.patch(
  '/user/:userId/notifications/:notificationId/sent',
  'NotificationController.markAsSentNotificationsById'
).middleware(['auth:jwt'])

Route.get(
  '/notifications/config',
  'NotificationConfigurationController.listNotificationConfigurations'
).middleware(['auth:jwt'])

Route.get(
  '/notifications/config/:id',
  'NotificationConfigurationController.listNotificationConfigurations'
).middleware(['auth:jwt'])

Route.post(
  '/notifications/config',
  'NotificationConfigurationController.createNotificationConfiguration'
).middleware(['auth:jwt'])

Route.delete(
  '/notifications/config/:id',
  'NotificationConfigurationController.deleteNotificationConfiguration'
).middleware(['auth:jwt'])

Route.patch(
  '/notifications/config/:id',
  'NotificationConfigurationController.patchNotificationConfiguration'
).middleware(['auth:jwt'])

Route.get(
  '/notifications/config/:configId/messages',
  'NotificationConfigurationController.listNotificationConfigurationsMessage'
).middleware(['auth:jwt'])

Route.get(
  '/notifications/config/:configId/messages/:messageId',
  'NotificationConfigurationController.getNotificationConfigurationsMessageById'
).middleware(['auth:jwt'])

Route.post(
  '/notifications/config/:configId/messages',
  'NotificationConfigurationController.createNotificationConfigurationMessage'
).middleware(['auth:jwt'])

Route.delete(
  '/notifications/config/:configId/messages/:messageId',
  'NotificationConfigurationController.deleteNotificationConfigurationMessage'
).middleware(['auth:jwt'])

Route.patch(
  '/notifications/config/:configId/messages/:messageId',
  'NotificationConfigurationController.patchNotificationConfigurationMessage'
).middleware(['auth:jwt'])

Route.get(
  '/notifications/source',
  'NotificationSourceController.listNotificationSource'
).middleware(['auth:jwt'])

Route.get(
  '/notifications/source/:id',
  'NotificationSourceController.getNotificationSourceById'
).middleware(['auth:jwt'])

/**
 * SAFE ROUTES
 */

Route.post('/safe', 'SafeController.createSafe').middleware([
  'auth:jwt',
  'validator:CreateSafeValidator',
  `acl:${permissions.safeWrite}`
])

Route.post('/safe/add-user', 'SafeController.addUsersToSafe').middleware([
  'auth:jwt',
  'validator:AddUserValidator',
  `acl:${permissions.safeWrite}`
])

/**
 * TESTING PURPOSE ONLY ROUTES
 */

Route.get('/test/one-permission', ({ response }) => {
  response.send({ message: 'Authorized!' })
}).middleware(['auth:jwt', 'acl:test1.read'])

Route.get('/test/two-permission', ({ response }) => {
  response.send({ message: 'Authorized!' })
}).middleware(['auth:jwt', 'acl:test1.read,test2.read'])

/**
 * HELP_REQUEST ROUTES
 */

Route.get('/help-requests', 'HelpRequestsController.listHelpRequests').middleware('auth:jwt')
Route.get('/help-request-values', 'HelpRequestsController.listHelpRequestValues').middleware(
  'auth:jwt'
)
Route.get('/help-request-functionalities', 'HelpRequestsController.listFunctionalities').middleware(
  'auth:jwt'
)

Route.post('/help-request', 'HelpRequestsController.createHelpRequest').middleware('auth:jwt')

/*
 * FEEDBACKS
 */
Route.get('/feedbacks', 'FeedbacksController.listFeedbacks').middleware('auth:jwt')
Route.post('/feedback', 'FeedbacksController.createFeedback').middleware([
  'auth:jwt',
  'validator:CreateFeedbackValidator'
])

/**
 * HEALTHCHECK ROUTES
 */

Route.get('/healthcheck', 'HealthchecksController.healthCheck')

/*
 * FREQUENCY ENDPOINTS
 */
Route.get('/frequency', 'FrequenciesController.listFrequencies').middleware('auth:jwt')
