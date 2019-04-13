import { NextFunction, Request, Response } from 'express-serve-static-core';
import { models, Schema, SchemaOptions, SchemaTypes, Types } from 'mongoose';
import { carShareInformationDefintion } from '../../definitions/car-share-information/car-share-information.defintion';
import { Method } from '../../enums/methods';
import { BaseRoute } from '../base-route';
import { carInformationDefinition } from './../../definitions/car-information/car-information.definition';

export class ReviewsRoute extends BaseRoute {
  constructor(uri: string, methods: any[]) {
    super(uri, methods)
  }

  setSchema(options: SchemaOptions) {
    return new Schema({
      rating: {
        type: SchemaTypes.Number,
        required: true
      },
      message: {
        type: SchemaTypes.String,
        required: true
      },
      reviewerId: {
        type: Types.ObjectId,
        required: true
      },
      carShareId: {
        type: Types.ObjectId,
        required: true
      }
    }, options)
  }

  setHandlers() {
    this.methods.forEach(method => {
      if (method.name === Method.GET) {
        method.handlers = [...method.handlers || [], this.aggregateData]
      }

      if (method.name === Method.POST) {
        method.handlers = [...method.handlers || [], this.verifyCarShareExists]
      }
    })
  }

  async aggregateData(req: Request, res: Response, next: NextFunction) {
    try {
      const aggregatedData = await models.Reviews.aggregate([
        { $match: req.query },
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
            from: 'cars',
            localField: 'carShareInformation.carId',
            foreignField: '_id',
            as: 'car'
          }
        },
        {
          $unwind: '$carShareInformation'
        },
      ]).project({
        rating: 1,
        message: 1,
        carShareInformation: carShareInformationDefintion,
        carInformation: carInformationDefinition,
        createdAt: 1,
        updatedAt: 1
      })

      res.status(200).send(aggregatedData)
    } catch (err) {
      next(err.message)
    }
  }
}