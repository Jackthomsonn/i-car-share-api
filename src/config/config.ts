export const config = {

  // Default Config
  APPLICATION_LOGO: 'http://www.stickpng.com/assets/images/5847f9cbcef1014c0b5e48c8.png',
  APPLICATION_NAME: 'ICarShare',
  PORT: process.env.PORT || 8080,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/i-car-share',
  MONGO_OPTIONS: {
    useNewUrlParser: true
  },
  LOG_ENV: process.env.LOG_ENV || 'development-logs',

  // Auth Specific Config
  AUTH_SECRET_KEY: '12345',
  AUTH_SECRET_KEY_FORGOTTEN_PASSWORD: '54321',
  REFRESH_TOKEN_SECRET_KEY: '52314',
  COOKIE_NAME: 'i-car-share',
  FORGGOTEN_PASSWORD_COOKIE_NAME: 'i-car-share-forgotten-password',
  EMAIL: 'no-reply@icarshare.co.uk',
  BASE_URI: '/api',
  TOKEN_EXPIRATION: 120000,
  SALT_WORK_FACTOR: 10,
  THEME_COLOUR: '#4096EE',
  EMAIL_VERIFICATION: true,
  PASSWORD_STRENGTH: '1',
  REFRESH_TOKEN_EXPIRATION: 3600000,
  UPDATE_PROFILE_JWT_EXPIRATION: 360000,
  UPDATE_PROFILE_JWT_KEY: '1772547',
  REFRESH_TOKEN_COOKIE_NAME: 'i-car-share-refresh'
}