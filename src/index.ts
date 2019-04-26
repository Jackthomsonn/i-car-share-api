import { Application } from './app';
import { Method } from './enums/methods';
import { BookingsRoute } from './routes/bookings/bookings';
import { CarSharesRoute } from './routes/car-shares/car-shares';
import { CarsRoute } from './routes/cars/cars';
import { LiveTrackerRoute } from './routes/live-tracker/live-tracker';
import { LocationsRoute } from './routes/location/location';
import { MessagesRoute } from './routes/messages/messages';
import { PushRegistrationRoute } from './routes/push-registration/push-registration';
import { ReviewsRoute } from './routes/reviews/reviews';
import { SocketsRoute } from './routes/sockets/sockets';

const { CheckAuthentication } = require('x-auth-plugin')

const carSharesRoute = new CarSharesRoute('/car-shares', [
  {
    name: Method.GET,
    handlers: [CheckAuthentication]
  }, {
    name: Method.POST,
    handlers: [CheckAuthentication]
  }, {
    name: Method.PUT,
    handlers: [CheckAuthentication]
  }, {
    name: Method.DELETE,
    handlers: [CheckAuthentication]
  }
])

const carsRoute = new CarsRoute('/cars', [
  {
    name: Method.GET,
    handlers: [CheckAuthentication]
  }, {
    name: Method.POST,
    handlers: [CheckAuthentication]
  }
])

const reviewsRoute = new ReviewsRoute('/reviews', [
  {
    name: Method.GET,
    handlers: [CheckAuthentication]
  }, {
    name: Method.POST,
    handlers: [CheckAuthentication]
  }
])

const bookingsRoute = new BookingsRoute('/bookings', [
  {
    name: Method.GET,
    handlers: [CheckAuthentication]
  }, {
    name: Method.POST,
    handlers: [CheckAuthentication]
  }, {
    name: Method.DELETE,
    handlers: [CheckAuthentication]
  }
])

const pushRegistrationRoute = new PushRegistrationRoute('/push-registration', [
  {
    name: Method.POST
  }
]);

const liveTrackerRoute = new LiveTrackerRoute('/live-tracker', [
  {
    name: Method.POST
  }
]);

const locationsRoute = new LocationsRoute('/locations', [
  {
    name: Method.POST,
    handlers: [CheckAuthentication]
  },
  {
    name: Method.GET,
    handlers: [CheckAuthentication]
  }
]);

const socketsRoute = new SocketsRoute('/sockets', [
  {
    name: Method.POST,
    handlers: [CheckAuthentication]
  },
  {
    name: Method.GET,
    handlers: []
  }
]);

const messagesRoute = new MessagesRoute('/messages', [
  {
    name: Method.POST,
    handlers: [CheckAuthentication]
  },
  {
    name: Method.GET,
    handlers: [CheckAuthentication]
  }
]);

new Application([
  carSharesRoute.create(),
  carsRoute.create(),
  reviewsRoute.create(),
  bookingsRoute.create(),
  pushRegistrationRoute.create(),
  liveTrackerRoute.create(),
  locationsRoute.create(),
  socketsRoute.create(),
  messagesRoute.create()
])