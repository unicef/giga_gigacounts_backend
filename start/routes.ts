import Route from '@ioc:Adonis/Core/Route'

import { permissions } from 'App/Helpers/constants'

Route.post('/api/login', 'UsersController.login').middleware('validator:LoginValidator')

Route.group(() => {
  /**
   * USER ROUTES
   */
  Route.get('/user/profile', 'UsersController.profile')
  /**
   * PAYMENT ROUTES
   */
  Route.get('/payment/frequencies', 'PaymentsController.listFrequencies')
  /**
   * SCHOOL ROUTES
   */
  Route.get('/school/country/:country_id', 'SchoolsController.listSchoolByCountry')
  /**
   * CURRENCY ROUTES
   */
  Route.get('/currency', 'CurrenciesController.listCurrencies')
  /**
   * COUNTRY ROUTES
   */
  Route.get('/country', 'CountriesController.listCountries')
  /**
   * CONTRACT ROUTES
   */
  Route.get('/contract/count/status', 'ContractsController.countByStatus').middleware(
    `acl:${permissions.contractRead}`
  )
  /**
   * ISP ROUTES
   */
  Route.get('/isp', 'IspsController.listIsps').middleware(`acl:${permissions.ispRead}`)
})
  .prefix('api')
  .middleware('auth:api')

/**
 * TESTING PURPOSE ONLY ROUTES
 */

Route.get('/test/one-permission', ({ response }) => {
  response.send({ message: 'Authorized!' })
}).middleware(['auth:api', 'acl:test1.read'])

Route.get('/test/two-permission', ({ response }) => {
  response.send({ message: 'Authorized!' })
}).middleware(['auth:api', 'acl:test1.read,test2.read'])
