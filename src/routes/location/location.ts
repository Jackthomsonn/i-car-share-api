import { NextFunction, Response } from 'express-serve-static-core';
import { models, Schema, SchemaOptions, Types } from 'mongoose';
import { Method } from '../../enums/methods';
import { PointSchema } from '../../schemas/point/point-schema';
import { BaseRoute } from '../base-route';

const { InternalServerError } = require('dynamic-route-generator');

export class LocationsRoute extends BaseRoute {
  constructor(uri: string, methods: any[]) {
    super(uri, methods)
  }

  setSchema(options: SchemaOptions) {
    return new Schema({
      location: {
        type: PointSchema,
        required: true
      },
      userId: {
        type: Types.ObjectId,
        required: true
      }
    }, options)
  }

  setHandlers() {
    this.methods.forEach(method => {
      if (method.name === Method.GET) {
        method.handlers = [...method.handlers || []];
      }

      if (method.name === Method.POST) {
        method.handlers = [...method.handlers || [], this.verifyUserHasNotSetPreferredLocationBefore]
      }
    })
  }

  async verifyUserHasNotSetPreferredLocationBefore(req: any, res: Response, next: NextFunction) {
    const { userId, location } = req.body

    try {
      const document: any = await models.Locations.findOne({ userId: Types.ObjectId(userId) })
      if (!document) {
        next()
      } else {
        document.location.coordinates = location.coordinates;
        document.location.type = location.type;

        try {
          await document.save();

          res.status(200).send();
        } catch (error) {
          throw new Error(error);
        }
      }
    } catch (err) {
      next(new InternalServerError(err))
    }
  }
}