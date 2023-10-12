import Route from '@ioc:Adonis/Core/Route'
import { permissions } from 'App/Helpers/constants'

/**
 * USER ROUTES
 */

Route.post('/login', 'UsersController.login').middleware('validator:LoginValidator')

Route.get('/user/profile', 'UsersController.profile').middleware('auth:api')

Route.get('/user/wallet-random-string', 'UsersController.generateWalletRandomString').middleware([
  'auth:api',
  `acl:${permissions.walletWrite}`
])

Route.post('/user/attach-wallet', 'UsersController.attachWallet').middleware([
  'auth:api',
  'validator:AttachWalletValidator'
])

Route.get(
  '/user/giga-token-owner-wallet-address',
  'UsersController.gigaTokenWalletOwnerAddress'
).middleware(['auth:api'])

Route.post('/user/permissions', 'UsersController.getPermissionsByEmail')

Route.patch(
  '/user/setting-automatic-contract',
  'UsersController.updateSettingAutomaticContracts'
).middleware([
  'auth:api',
  `acl:${permissions.userSettingsWrite}`,
  'validator:UpdateSettingAutomaticContractsValidator'
])

Route.get('/user', 'UsersController.listUsers').middleware([
  'auth:api',
  `acl:${permissions.userRead}`
])

/**
 * PAYMENT ROUTES
 */

Route.get('/payment', 'PaymentsController.getPayments').middleware([
  'auth:api',
  `acl:${permissions.paymentRead}:${permissions.contractRead}`
])

Route.post('/payment/measures', 'PaymentsController.getPaymentMeasures').middleware([
  'auth:api',
  `acl:${permissions.paymentRead}:${permissions.measureRead}`
])

Route.get('/payment/frequencies', 'PaymentsController.listFrequencies')

Route.post('/payment', 'PaymentsController.createPayment').middleware([
  'auth:api',
  'validator:CreatePaymentValidator',
  `acl:${permissions.paymentWrite}`
])

Route.get('/payment/contract/:contract_id', 'PaymentsController.getPaymentsByContract').middleware([
  'auth:api',
  `acl:${permissions.paymentRead}:${permissions.contractRead}`
])

Route.get('/payment/:payment_id', 'PaymentsController.getPayment').middleware([
  'auth:api',
  `acl:${permissions.paymentRead}`
])

Route.post('/payment/change-status', 'PaymentsController.changePaymentStatus').middleware([
  'auth:api',
  'validator:ChangePaymentStatusValidator',
  `acl:${permissions.paymentWrite}`
])

Route.put('/payment', 'PaymentsController.updatePayment').middleware([
  'auth:api',
  'validator:UpdatePaymentValidator',
  `acl:${permissions.paymentWrite}`
])

/**
 * ISP ROUTES
 */

Route.get('/isp', 'IspsController.listIsps').middleware(['auth:api', `acl:${permissions.ispRead}`])

/**
 * METRIC ROUTES
 */
Route.get('/metric/suggested-values', 'MetricsController.listMetricsSuggestedValues').middleware([
  'auth:api',
  `acl:${permissions.metricRead}`
])

/**
 * BLOCKCHAIN TRANSACTIONS
 */
Route.get('/blk/', 'BlockchainTransactionsController.listBlockchainTransactions').middleware([
  'auth:api',
  `acl:${permissions.blockchainTransactionsRead}`
])

Route.post('/blk/', 'BlockchainTransactionsController.createBlockchainTransaction').middleware([
  'auth:api',
  'validator:CreateBlockchainTransactionValidator',
  `acl:${permissions.blockchainTransactionsWrite}`
])

/**
 * SCHOOL ROUTES
 */

Route.get('/school/pagination', 'SchoolsController.listSchoolsPagination').middleware([
  'auth:api',
  `acl:${permissions.schoolRead}`
])

Route.post('/school/csv', 'SchoolsController.searchSchoolsByExternalId').middleware([
  'auth:api',
  `acl:${permissions.schoolRead}`
])

Route.get('/school/search', 'SchoolsController.searchSchools').middleware([
  'auth:api',
  `acl:${permissions.schoolRead}`
])

Route.patch('/school', 'SchoolsController.updateSchoolReliableMeasures').middleware([
  'auth:api',
  `acl:${permissions.schoolWrite}`
])

/**
 * SCHOOL MEASURES
 */

Route.post('/school/measures', 'SchoolsController.getSchoolsMeasures').middleware([
  'auth:api',
  'validator:SchoolMeasuresValidator',
  `acl:${permissions.schoolRead}:${permissions.measureRead}`,
  `cache:${60 * 60 * 4}`
])

/**
 * CURRENCY ROUTES
 */

Route.get('/currency', 'CurrenciesController.listCurrencies').middleware([
  'auth:api',
  `cache:${60 * 60 * 24}`
])

/**
 * COUNTRY ROUTES
 */

Route.get('/country', 'CountriesController.listCountries').middleware([
  'auth:api',
  `cache:${60 * 60 * 24}`
])

/**
 * CONTRACT ROUTES
 */

Route.get('/contract/count/status', 'ContractsController.countByStatus').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`
])

Route.post('/contract', 'ContractsController.createContract').middleware([
  'auth:api',
  'validator:CreateContractValidator',
  `acl:${permissions.contractWrite}`
])

Route.post('/contract/draft', 'ContractsController.saveDraft').middleware([
  'auth:api',
  'validator:SaveDraftValidator',
  `acl:${permissions.contractWrite}`
])

Route.get('/contract/draft/:draft_id', 'ContractsController.getDraft').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`
])

Route.put('/contract/draft', 'ContractsController.updateDraft').middleware([
  'auth:api',
  'validator:UpdateDraftValidator',
  `acl:${permissions.contractWrite}`
])

Route.get('/contract', 'ContractsController.contractList').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`
])

Route.post('/contract/change-status', 'ContractsController.changeStatus').middleware([
  'auth:api',
  'validator:ChangeStatusValidator',
  `acl:${permissions.contractWrite}`
])

Route.post('/contract/publish', 'ContractsController.publishContract').middleware([
  'auth:api',
  'validator:PublishContractValidator',
  `acl:${permissions.contractWrite}`
])

Route.post('/contract/approve', 'ContractsController.approveContract').middleware([
  'auth:api',
  'validator:ApproveContractValidator',
  `acl:${permissions.contractApprove}`
])

Route.get('/contract/details/:contract_id', 'ContractsController.getContractDetails').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`
])

Route.get('/contract/schools/:contract_id', 'ContractsController.getContractSchools').middleware([
  'auth:api',
  `acl:${permissions.contractRead},${permissions.schoolRead}`
])

Route.get(
  '/contract/school/connectivity',
  'ContractsController.getContractSchoolConnectivity'
).middleware(['auth:api', `acl:${permissions.contractRead}`])

Route.get('/contract/:contract_id', 'ContractsController.getContract').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`
])

Route.patch('/contract/batch', 'ContractsController.contractStatusBatchUpdate').middleware([
  'auth:api',
  `acl:${permissions.contractWrite}`
])

Route.get('/contract/daily/measures', 'ContractsController.loadContractsDailyMeasures').middleware([
  'auth:api',
  `acl:${permissions.contractRead}:${permissions.measureRead}`
])

Route.delete('/contract/draft/:draft_id', 'ContractsController.deleteDraft').middleware([
  'auth:api',
  `acl:${permissions.contractWrite}`
])

Route.get(
  '/contract/available-payments/:contract_id',
  'ContractsController.getContractAvailablePayments'
).middleware(['auth:api', `acl:${permissions.contractRead}:${permissions.paymentRead}`])

Route.post('/contract/duplicate/:contract_id', 'ContractsController.duplicateContract').middleware([
  'auth:api',
  `acl:${permissions.contractDuplicate}`
])

Route.post('/contract/draft/duplicate/:draft_id', 'ContractsController.duplicateDraft').middleware([
  'auth:api',
  `acl:${permissions.contractDuplicate}`
])

Route.post(
  '/contract/generate-sign-random-string',
  'ContractsController.generateSignContractRandomString'
).middleware([
  'auth:api',
  'validator:GenerateSignContractRandomStringValidator',
  `acl:${permissions.contractSignWithWallet}`
])

Route.post('/contract/sign-with-wallet', 'ContractsController.signContractWithWallet').middleware([
  'auth:api',
  'validator:SignContractWithWalletValidator',
  `acl:${permissions.contractSignWithWallet}`
])

/**
 * ATTACHMENTS ROUTES
 */

Route.post('/attachments/upload', 'AttachmentsController.upload').middleware([
  'auth:api',
  'validator:UploadFileValidator',
  `acl:${permissions.attachmentWrite}`
])

Route.delete('/attachments/:attachmentId', 'AttachmentsController.deleteAttachment').middleware([
  'auth:api',
  `acl:${permissions.attachmentWrite}`
])

Route.get('/attachments/:attachment_id', 'AttachmentsController.getAttachment').middleware([
  'auth:api',
  `acl:${permissions.attachmentRead}`
])

/**
 * ISP CONTACTS ROUTES
 */

Route.post('/contact/isp', 'IspContactsController.upload').middleware([
  'auth:api',
  `acl:${permissions.contractWrite}`
])

Route.delete('/contact/isp', 'IspContactsController.deleteIspContact').middleware([
  'auth:api',
  `acl:${permissions.contractWrite}`
])

/**
 * STAKEHOLDERS ROUTES
 */

Route.post('/stakeholder', 'StakeholdersController.upload').middleware([
  'auth:api',
  `acl:${permissions.contractWrite}`
])

Route.delete('/stakeholder', 'StakeholdersController.deleteStakeholder').middleware([
  'auth:api',
  `acl:${permissions.contractWrite}`
])

/**
 * MEASURE ROUTES
 */

Route.post('/measure/calculate', 'MeasuresController.calculateMeasuresByMonthYear').middleware([
  'auth:api',
  'validator:CalculateMeasuresValidator',
  `acl:${permissions.measureRead}`
])

/**
 * NOTIFICATIONS
 */

Route.get('/notifications', 'NotificationController.getNotifications').middleware(['auth:api'])

Route.get(
  '/user/:userId/notifications/',
  'NotificationController.getNotificationsByUserId'
).middleware(['auth:api'])

Route.get(
  '/user/:userId/notifications/:notificationId',
  'NotificationController.getNotificationById'
).middleware(['auth:api'])

Route.patch(
  '/user/:userId/notifications/:notificationId/read',
  'NotificationController.markAsReadNotificationsById'
).middleware(['auth:api'])

Route.patch(
  '/user/:userId/notifications/:notificationId/discard',
  'NotificationController.markAsDiscardedNotificationsById'
).middleware(['auth:api'])

Route.patch(
  '/user/:userId/notifications/:notificationId/sent',
  'NotificationController.markAsSentNotificationsById'
).middleware(['auth:api'])

Route.get(
  '/notifications/config',
  'NotificationConfigurationController.listNotificationConfigurations'
).middleware(['auth:api'])

Route.get(
  '/notifications/config/:id',
  'NotificationConfigurationController.listNotificationConfigurations'
).middleware(['auth:api'])

Route.post(
  '/notifications/config',
  'NotificationConfigurationController.createNotificationConfiguration'
).middleware(['auth:api'])

Route.delete(
  '/notifications/config/:id',
  'NotificationConfigurationController.deleteNotificationConfiguration'
).middleware(['auth:api'])

Route.patch(
  '/notifications/config/:id',
  'NotificationConfigurationController.patchNotificationConfiguration'
).middleware(['auth:api'])

Route.get(
  '/notifications/config/:configId/messages',
  'NotificationConfigurationController.listNotificationConfigurationsMessage'
).middleware(['auth:api'])

Route.get(
  '/notifications/config/:configId/messages/:messageId',
  'NotificationConfigurationController.getNotificationConfigurationsMessageById'
).middleware(['auth:api'])

Route.post(
  '/notifications/config/:configId/messages',
  'NotificationConfigurationController.createNotificationConfigurationMessage'
).middleware(['auth:api'])

Route.delete(
  '/notifications/config/:configId/messages/:messageId',
  'NotificationConfigurationController.deleteNotificationConfigurationMessage'
).middleware(['auth:api'])

Route.patch(
  '/notifications/config/:configId/messages/:messageId',
  'NotificationConfigurationController.patchNotificationConfigurationMessage'
).middleware(['auth:api'])

Route.get(
  '/notifications/source',
  'NotificationSourceController.listNotificationSource'
).middleware(['auth:api'])

Route.get(
  '/notifications/source/:id',
  'NotificationSourceController.getNotificationSourceById'
).middleware(['auth:api'])

/**
 * HELP_REQUEST ROUTES
 */

Route.get('/help-requests', 'HelpRequestsController.listHelpRequests').middleware([
  'auth:api',
  `acl:${permissions.helpRequestRead}`
])

Route.get('/help-request-values', 'HelpRequestsController.listHelpRequestValues').middleware([
  'auth:api',
  `cache:${60 * 60 * 24}`
])

Route.post('/help-request', 'HelpRequestsController.createHelpRequest').middleware([
  'auth:api',
  'validator:CreateHelpRequestValidator',
  'throttle:2,300000' // max-attempts 2, time-limit-after-exceeding-quota: 5 min
])

/*
 * FEEDBACKS
 */
Route.get('/feedbacks', 'FeedbacksController.listFeedbacks').middleware([
  'auth:api',
  `acl:${permissions.feedbackRead}`
])

Route.post('/feedback', 'FeedbacksController.createFeedback').middleware([
  'auth:api',
  'validator:CreateFeedbackValidator',
  'throttle:2,300000' // max-attempts 2, time-limit-after-exceeding-quota: 5 min
])

/**
 * HEALTHCHECK ROUTES
 */

Route.get('/healthcheck', 'HealthchecksController.healthCheck')

/*
 * FREQUENCY ENDPOINTS
 */
Route.get('/frequency', 'FrequenciesController.listFrequencies').middleware([
  'auth:api',
  `cache:${60 * 60 * 4}`
])

/**
 * DASHBOARD
 */

Route.get('/dashboard/schools', 'DashboardController.listDashboardSchools').middleware([
  'auth:api',
  `acl:${permissions.schoolRead}`,
  `cache:${60 * 60 * 24}`
])

Route.get('/dashboard/contracts/not-meets', 'DashboardController.listNotMeetsSla').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`,
  `cache:${60 * 60}`
])

/**
 * Settings
 */
Route.get('/setting', 'SettingsController.getSettings').middleware(['auth:api'])

Route.get('/setting/:key', 'SettingsController.getSettingValue').middleware([
  'auth:api',
  `cache:${60 * 60 * 4}`
])

// dummy
Route.get('/dummy/k/:contract_id', 'DummyController.dummyCashback').middleware(['auth:api'])
Route.get('/dummy/p/:contract_id', 'DummyController.dummyAutomaticPayment').middleware(['auth:api'])
Route.get('/dummy/e/', 'DummyController.dummyEnvCheck').middleware(['auth:api'])
