import { Response, NextFunction } from 'express-serve-static-core';
import mongoose from 'mongoose'
import { Schema, SchemaOptions, Types } from 'mongoose';
import { BaseRoute } from '../base-route';
import { Exceptions } from '../../enums/exceptions';

const { NotFound, InternalServerError } = require('dynamic-route-generator')

export class BookingsRoute extends BaseRoute {
  constructor(uri: string, methods: any[]) {
    super(uri, methods)
  }

  setHandlers() {
    this.methods.forEach(method => {
      if (method.name === 'post') {
        method.handlers = [...method.handlers || [], this.verifyUserExists, this.verifyCarShareExists, this.verifyUserIsNotAlreadyBookedOntoCarShare]
      }
    })
  }

  async verifyUserIsNotAlreadyBookedOntoCarShare(req: any, _res: Response, next: NextFunction) {
    const { carShareId, userId } = req.body

    try {
      const document = await mongoose.models.Bookings.find({ carShareId: Types.ObjectId(carShareId), userId: Types.ObjectId(userId) })
      if (document.length === 0) {
        next()
      } else {
        next(new NotFound(Exceptions.ALREADY_BOOKED_ON))
      }
    } catch (err) {
      next(new InternalServerError(err))
    }
  }

  setSchema(options: SchemaOptions) {
    return new Schema({
      carShareId: {
        type: Types.ObjectId,
        required: true
      },
      userId: {
        type: Types.ObjectId,
        required: true
      }
    }, options)
  }
}