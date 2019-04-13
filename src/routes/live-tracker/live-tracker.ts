import { NextFunction, Request, Response } from 'express-serve-static-core';
import { models, Schema, SchemaOptions, Types } from 'mongoose';
import { BaseRoute } from '../base-route';
import { PointSchema } from './../../schemas/point/point-schema';
import { Method } from '../../enums/methods';

const { InternalServerError } = require('dynamic-route-generator')

export class LiveTrackerRoute extends BaseRoute {
  constructor(uri: string, methods: any[]) {
    super(uri, methods)
  }

  setSchema(options: SchemaOptions) {
    return new Schema({
      carShareId: {
        type: Types.ObjectId,
        required: true
      },
      ownerId: {
        type: Types.ObjectId,
        required: true
      },
      coordinates: {
        type: PointSchema,
        required: true
      }
    }, options)
  }

  setHandlers() {
    this.methods.forEach(method => {
      if (method.name === Method.POST) {
        method.handlers = [...method.handlers || [], this.handleLiveTracking]
      }
    })
  }

  private async handleLiveTracking(req: Request, _res: Response, next: NextFunction) {
    const { carShareId, ownerId, coordinates } = req.body

    try {
      const document = await models.LiveTracker.findOne({
        carShareId: Types.ObjectId(carShareId),
        ownerId: Types.ObjectId(ownerId)
      })

      if (!document) {
        next()
      } else {
        document.coordinates = {
          coordinates: coordinates.coordinates,
          type: coordinates.type
        }

        await document.save();
      }
    } catch (err) {
      next(new InternalServerError(err))
    }
  }
}