import { NextFunction, Request, Response } from 'express-serve-static-core';
import { Schema, SchemaTypes, SchemaOptions, Types } from 'mongoose';
import { BaseRoute } from '../base-route';
import mongoose from 'mongoose'

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
        required: false
      }
    }, options)
  }

  setHandlers() {
    this.methods.forEach(method => {
      if (method.name === 'get') {
        method.handlers = [...method.handlers || [], this.aggregateData]
      }

      if (method.name === 'post') {
        method.handlers = [...method.handlers || [], this.verifyCarShareExists]
      }
    })
  }

  async aggregateData(req: Request, res: Response, next: NextFunction) {
    try {
      const aggregatedData = await mongoose.models.Reviews.aggregate([
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
        carShareInformation: {
          origin: {
            coordinates: 1
          },
          destination: {
            coordinates: 1
          },
          price: 1
        },
        car: {
          rules: 1,
          ownerId: 1,
          passengers: 1,
          reg: 1,
          make: 1
        },
        createdAt: 1,
        updatedAt: 1
      })

      res.status(200).send(aggregatedData)
    } catch (err) {
      next(err.message)
    }
  }
}