import express, { Express } from 'express';
import { connect } from 'mongoose';
import { config } from './config/config';

const cors = require('cors');

const { RouteGenerator } = require('dynamic-route-generator')
const { XAuth } = require('x-auth-plugin')

export class Application {
  private app: Express = express()

  constructor(private routes: any[]) {
    this.activate()
  }

  private setupXAuthProps() {
    XAuth.setupProps({
      appLogo: config.APPLICATION_LOGO,
      appName: config.APPLICATION_NAME,
      authSecretKey: config.AUTH_SECRET_KEY,
      authSecretKeyForgottenPassword: config.AUTH_SECRET_KEY_FORGOTTEN_PASSWORD,
      cookieName: config.COOKIE_NAME,
      cookieNameForgottenPassword: config.FORGGOTEN_PASSWORD_COOKIE_NAME,
      domainEmail: config.EMAIL,
      baseUri: config.BASE_URI,
      jwtTokenExpiration: config.TOKEN_EXPIRATION,
      saltWorkFactor: config.SALT_WORK_FACTOR,
      databaseUri: config.MONGO_URI,
      themeColour: config.THEME_COLOUR,
      emailVerification: config.EMAIL_VERIFICATION,
      passwordStrength: config.PASSWORD_STRENGTH,
      refreshTokenExpiration: config.REFRESH_TOKEN_EXPIRATION,
      refreshTokenSecretKey: config.REFRESH_TOKEN_SECRET_KEY,
      refreshTokenCookieName: config.REFRESH_TOKEN_COOKIE_NAME,
      updateProfileJwtExpiration: config.UPDATE_PROFILE_JWT_EXPIRATION,
      updateProfileJwtKey: config.UPDATE_PROFILE_JWT_KEY,
      textMagicUsername: 'jackthomson',
      textMagicToken: '0iavoUsgPnPO09cMrtS0OHedFajMnD'
    })
  }

  private async activate() {
    this.setupXAuthProps()

    await connect(config.MONGO_URI, config.MONGO_OPTIONS)

    this.app.use(cors())

    new RouteGenerator({
      routes: this.routes,
      app: this.app,
      plugins: {
        pre: [XAuth],
        post: []
      }
    })

    this.app.listen(config.PORT)
  }
}