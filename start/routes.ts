import Route from '@ioc:Adonis/Core/Route'

import { permissions } from 'App/Helpers/constants'

/**
 * USER ROUTES
 */

Route.get('/user/profile', 'UsersController.profile').middleware('auth:api')
Route.post('/login', 'UsersController.login').middleware('validator:LoginValidator')

/**
 * CONTRACT ROUTES
 */

Route.get('/contract/count/status', 'ContractsController.countByStatus').middleware([
  'auth:api',
  `acl:${permissions.contractRead}`,
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
