import Route from '@ioc:Adonis/Core/Route'

/**
 * USER ROUTES
 */

Route.get('/user/profile', 'UsersController.profile').middleware('auth:api')
Route.post('/login', 'UsersController.login').middleware('validator:LoginValidator')

/**
 * CONTRACT ROUTES
 */
Route.get('/contract/count/status', 'ContractsController.countByStatus').middleware('auth:api')
