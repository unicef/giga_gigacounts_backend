import Route from '@ioc:Adonis/Core/Route'

/**
 * USER ROUTES
 */

Route.get('/user/profile', 'UsersController.profile').middleware('auth:api')
Route.post('/login', 'UsersController.login').middleware('validator:LoginValidator')

/**
 * CURRENCY ROUTES
 */

Route.get('/currency', 'CurrenciesController.listCurrencies').middleware('auth:api')
