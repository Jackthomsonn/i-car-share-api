import { NextFunction, Request, Response } from 'express-serve-static-core';
import { models, Schema, SchemaOptions, Types } from 'mongoose';
import { carShareInformationDefintion } from '../../definitions/car-share-information/car-share-information.defintion';
import { Exceptions } from '../../enums/exceptions';
import { Method } from '../../enums/methods';
import { BaseRoute } from '../base-route';
import { locationInformationDefinition } from './../../definitions/location-information/location-information.defintion';

const { BadRequest, InternalServerError } = require('dynamic-route-generator')

export class BookingsRoute extends BaseRoute {
  constructor(uri: string, methods: any[]) {
    super(uri, methods)
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

  setHandlers() {
    this.methods.forEach(method => {
      if (method.name === Method.GET) {
        method.handlers = [...method.handlers || [], this.aggregateData];
      }

      if (method.name === Method.POST) {
        method.handlers = [...method.handlers || [], this.verifyUserExists, this.verifyCarShareExists, this.verifyUserIsNotAlreadyBookedOntoCarShare]
      }
    })
  }

  private async aggregateData(req: Request, res: Response, next: NextFunction) {
    if (req.params.id) {
      next()
    }

    try {
      let aggregatedData;

      if (req.query.userId) {
        aggregatedData = await models.Bookings.aggregate([
          { $match: { userId: Types.ObjectId(req.query.userId) } },
          {
            $lookup: {
              from: 'carshares',
              localField: 'carShareId',
              foreignField: '_id',
              as: 'carShareInformation'
            }
          },
          {
            $lookup: {
              from: 'locations',
              localField: 'userId',
              foreignField: 'userId',
              as: 'locationInformation'
            }
          },
          {
            $unwind: '$carShareInformation'
          },
          {
            $unwind: '$locationInformation'
          }
        ]).project({
          carShareId: 1,
          userId: 1,
          carShareInformation: carShareInformationDefintion,
          locationInformation: locationInformationDefinition
        })
      } else {
        aggregatedData = await models.Bookings.aggregate([
          {
            $lookup: {
              from: 'carshares',
              localField: 'carShareId',
              foreignField: '_id',
              as: 'carShareInformation'
            }
          },
          {
            $lookup: {
              from: 'locations',
              localField: 'userId',
              foreignField: 'userId',
              as: 'locationInformation'
            }
          },
          {
            $unwind: '$carShareInformation'
          },
          {
            $unwind: '$locationInformation'
          }
        ]).project({
          carShareId: 1,
          userId: 1,
          carShareInformation: carShareInformationDefintion,
          locationInformation: locationInformationDefinition
        })
      }

      res.status(200).send(aggregatedData)
    } catch (err) {
      next(err.message)
    }
  }

  private async verifyUserIsNotAlreadyBookedOntoCarShare(req: any, _res: Response, next: NextFunction) {
    const { carShareId, userId } = req.body

    try {
      const document = await models.Bookings.find({ carShareId: Types.ObjectId(carShareId), userId: Types.ObjectId(userId) })
      if (document.length === 0) {
        next()
      } else {
        next(new BadRequest(Exceptions.ALREADY_BOOKED_ON))
      }
    } catch (err) {
      next(new InternalServerError(err))
    }
  }
}