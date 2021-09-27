/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'



Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(()=>{
  Route.post('/register','AuthsController.register').as('auth.register')
  Route.post('/login','AuthsController.login').as('auth.login')
  Route.post('/otp-confirmation','AuthsController.otp_verification').as('auth.otp-confirmation')
  Route.group(()=>{
    Route.resource('venues','VenuesController').apiOnly().middleware({
      store:['owner'],
      update:['owner'],
      destroy:['owner']
    })
    Route.resource('venues.fileds','FieldsController').apiOnly().middleware({
      store:['owner'],
      update:['owner'],
      destroy:['owner']})
    Route.resource('fields.bookings','BookingsController').apiOnly()
    Route.put('/bookings/:id','BookingsController.join').as('bookings.join-unjoin')
    Route.get('/schedules','BookingsController.schedules').as('bookings.schedules')
  }).middleware(['auth'])
  // Route.put('/bookings/:id/unjoin','BookingsController.unjoin').middleware(['auth'])
  // Route.post('/bookings','BookingsController.bookings').middleware(['auth'])
}).prefix('/api/v1')


