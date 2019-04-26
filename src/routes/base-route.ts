import { NextFunction, Response } from 'express-serve-static-core';
import mongoose, { model, Schema, SchemaOptions, Types } from 'mongoose';
import { Exceptions } from '../enums/exceptions';
import { IBaseRoute } from '../interfaces/IBaseRoute';

const { NotFound, InternalServerError, Unauthorized } = require('dynamic-route-generator')
const jwt = require('jsonwebtoken')

export abstract class BaseRoute implements IBaseRoute {
  constructor(protected uri: string, protected methods: any[]) { }

  setSchema(_options?: SchemaOptions) {
    return new Schema()
  }

  setHandlers() {
  }

  setGlobalHandlers() {
    return []
  }

  create() {
    this.setHandlers()

    return {
      uri: this.uri,
      model: model(this.constructor.name.split('Route')[0], this.setSchema({ timestamps: true })),
      methods: this.methods,
      handlers: this.setGlobalHandlers()
    }
  }

  async verifyRequestIsForUser(req: any, _res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      next(new Unauthorized());
    }

    const token = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = jwt.decode(token);
      const user = await mongoose.connection.db.collection('users').findOne({ username: decodedToken.data.username });

      if (user._id == req.query.senderId) {
        next()
      } else {
        next(new Unauthorized(Exceptions.DOES_NOT_BELONG_TO_YOU))
      }
    } catch (err) {
      next(new InternalServerError(err))
    }
  }

  async verifyUserExists(req: any, _res: Response, next: NextFunction) {
    const { ownerId, userId } = req.body

    try {
      const exists = await mongoose.connection.db.collection('users').find({ _id: Types.ObjectId(ownerId ? ownerId : userId) }).count();

      if (exists !== 0) {
        next()
      } else {
        next(new NotFound(Exceptions.USER_NOT_FOUND))
      }
    } catch (err) {
      next(new InternalServerError(err))
    }
  }

  async verifyCarExists(req: any, _res: Response, next: NextFunction) {
    const { carId } = req.body

    try {
      const document = await mongoose.models.Cars.findById(carId)
      if (document) {
        next()
      } else {
        next(new NotFound(Exceptions.CAR_NOT_FOUND))
      }
    } catch (err) {
      next(new InternalServerError(err))
    }
  }

  async verifyCarShareExists(req: any, _res: Response, next: NextFunction) {
    const { carShareId } = req.body

    try {
      const document = await mongoose.models.CarShares.findById(carShareId)
      if (document) {
        next()
      } else {
        next(new NotFound(Exceptions.CAR_SHARE_NOT_FOUND))
      }
    } catch (err) {
      next(new InternalServerError(err))
    }
  }
}