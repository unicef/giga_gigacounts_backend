import Route from '@ioc:Adonis/Core/Route'

/**
 * USER ROUTES
 */

Route.get('/user/profile', 'UsersController.profile').middleware('auth:api')
Route.post('/login', 'UsersController.login').middleware('validator:LoginValidator')

/**
 * METRIC ROUTES
 */

Route.get('/metric/suggested-values', 'MetricsController.listMetricsSuggestedValues').middleware(
  'auth:api'
)
