import Route from '@ioc:Adonis/Core/Route'

/**
 * USER ROUTES
 */

Route.get('/user/profile', 'UsersController.profile').middleware('auth:api')
Route.post('/login', 'UsersController.login').middleware('validator:LoginValidator')

/**
 * SCHOOL ROUTES
 */

Route.get('/school/country/:country_id', 'SchoolsController.listSchoolByCountry').middleware(
  'auth:api'
)
