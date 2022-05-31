import Route from '@ioc:Adonis/Core/Route'

/**
 * USER ROUTES
 */

Route.get('/user/profile', 'UsersController.profile').middleware('auth:api')
Route.post('/login', 'UsersController.login').middleware('validator:LoginValidator')

<<<<<<< HEAD
Route.get('/', ({ response }) => {
  response.send('Here')
}).middleware(['auth:api', 'acl:contracts.read'])
=======
/**
 * CONTRACT ROUTES
 */
Route.get('/contract/count/status', 'ContractsController.countByStatus').middleware('auth:api')
>>>>>>> CU-2t8qe7r-contract-status
