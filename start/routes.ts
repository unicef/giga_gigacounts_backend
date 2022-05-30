import Route from '@ioc:Adonis/Core/Route'

/**
 * USER ROUTES
 */

Route.get('/user/profile', 'UsersController.profile').middleware('auth:api')
Route.post('/login', 'UsersController.login').middleware('validator:LoginValidator')

Route.get('/', ({ response }) => {
  response.send('Here')
}).middleware(['auth:api', 'acl:contracts.read'])
