import express, { Express } from 'express';
import { connect } from 'mongoose';
import { config } from './config/config';
import { socket } from './config/socket';

const winston = require('winston');
const cors = require('cors');

const { Loggly } = require('winston-loggly-bulk');
const { RouteGenerator } = require('dynamic-route-generator')
const { XAuth } = require('x-auth-plugin')

export class Application {
  private app: Express = express()
  private http = require('http').Server(this.app);
  private io = require('socket.io')(this.http, { serveClient: false });

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

  private setupSocket() {
    socket(this.io);
  }

  private handleApplicationErrors() {
    this.app.use((err: any, _req: any, res: any, _next: any) => {
      res.status(err.status).send({
        message: err.message,
        status: err.status
      });

      winston.log('error', {
        message: err.message,
        status: err.status,
        stack: err.stack
      });
    });
  }

  private async activate() {
    this.setupXAuthProps()

    await connect(config.MONGO_URI, config.MONGO_OPTIONS)

    winston.add(new Loggly({
      token: "fbea1a66-aa1c-4501-a1ce-35cf4ad9e2f8",
      subdomain: "i-car-share",
      tags: [config.LOG_ENV],
      json: true
    }));

    this.app.use(cors({ credentials: true, origin: 'http://192.168.0.32:8100' }))

    new RouteGenerator({
      routes: this.routes,
      app: this.app,
      plugins: {
        pre: [XAuth],
        post: []
      }
    });

    this.app.get('/test', (_req, res) => {
      this.io.emit('location:reached')
      res.status(200).send();
    });

    this.handleApplicationErrors();

    this.setupSocket();

    this.http.listen(config.PORT)
  }
}