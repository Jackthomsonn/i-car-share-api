import { BookingsRoute } from './routes/bookings/bookings';
import { Application } from './app';
import { Method } from './enums/methods';
import { CarSharesRoute } from './routes/car-shares/car-shares';
import { CarsRoute } from './routes/cars/cars';
import { ReviewsRoute } from './routes/reviews/reviews';
const { CheckAuthentication } = require('x-auth-plugin')

const carSharesRoute = new CarSharesRoute('/car-shares', [{
  name: Method.GET,
  handlers: [CheckAuthentication],
}, {
  name: Method.POST,
  handlers: [CheckAuthentication],
}, {
  name: Method.PUT,
  handlers: [CheckAuthentication],
}])

const carsRoute = new CarsRoute('/cars', [{
  name: Method.GET,
  handlers: [CheckAuthentication],
}, {
  name: Method.POST,
  handlers: [CheckAuthentication],
}])

const reviewsRoute = new ReviewsRoute('/reviews', [{
  name: Method.GET,
  handlers: [CheckAuthentication],
}, {
  name: Method.POST,
  handlers: [CheckAuthentication],
}])

const bookingsRoute = new BookingsRoute('/bookings', [{
  name: Method.GET,
  handlers: [CheckAuthentication],
}, {
  name: Method.POST,
  handlers: [CheckAuthentication],
}])

new Application([
  carSharesRoute.create(),
  carsRoute.create(),
  reviewsRoute.create(),
  bookingsRoute.create()
])