import { Exceptions } from './../../enums/exceptions';
import { PointSchema } from './../../schemas/point/point-schema';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { BaseRoute } from '../base-route';
import { Schema, SchemaOptions, Types } from 'mongoose';
import { SchemaTypes } from 'mongoose'
import mongoose from 'mongoose'
import { ObjectId } from 'bson';

const { NotFound, InternalServerError } = require('dynamic-route-generator')

export class CarSharesRoute extends BaseRoute {
  constructor(uri: string, methods: any[]) {
    super(uri, methods)
  }

  setSchema(options: SchemaOptions) {
    return new Schema({
      ownerId: {
        type: Types.ObjectId,
        required: true
      },
      carId: {
        type: Types.ObjectId,
        required: true
      },
      origin: {
        type: PointSchema,
        required: true
      },
      destination: {
        type: PointSchema,
        required: true
      },
      price: {
        type: SchemaTypes.Number,
        required: true
      },
      runningDays: {
        type: SchemaTypes.Array,
        required: true
      },
      calculatedDistance: {
        type: SchemaTypes.Number,
        required: false
      }
    }, options).index({ origin: '2dsphere' });
  }

  setHandlers() {
    this.methods.forEach(method => {
      if (method.name === 'get') {
        method.handlers = [...method.handlers || [], this.aggregateData]
      }

      if (method.name === 'post') {
        method.handlers = [...method.handlers || [], this.verifyCarExists]
      }
    })
  }

  async aggregateData(req: Request, res: Response, next: NextFunction) {
    if (req.params.id) {
      next()
    }

    try {
      let query = undefined;
      let locationQuery = undefined;
      let aggregatedDataToUse = undefined;

      if (req.query.ownerId) {
        query = { ownerId: mongoose.Types.ObjectId(req.query.ownerId) };
      }

      if (req.query.lng && req.query.lat && req.query.distance) {
        const { lng, lat, distance } = req.query;

        console.log(
          'Looking at lng: ' + lng + ' and lat: ' + lat + ' with a distance of ' + distance
        )

        locationQuery = {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: "distance.calculatedDistance",
          includeLocs: "distance.location",
          maxDistance: parseInt(distance),
          spherical: true
        }
      }

      const fieldsToProject = {
        origin: {
          coordinates: 1
        },
        destination: {
          coordinates: 1
        },
        price: 1,
        carInformation: {
          _id: 1,
          passengers: 1,
          rules: 1,
          make: 1
        },
        runningDays: 1,
        ownerInformation: {
          _id: 1,
          username: 1
        },
        createdAt: 1,
        updatedAt: 1,
        distance: 1
      };

      if (locationQuery) {
        aggregatedDataToUse = await mongoose.models.CarShares.aggregate([
          {
            $geoNear: locationQuery
          },
          { $match: query ? query : {} },
          {
            $lookup: {
              from: 'cars',
              localField: 'carId',
              foreignField: '_id',
              as: 'carInformation'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'ownerId',
              foreignField: '_id',
              as: 'ownerInformation'
            }
          },
          {
            $unwind: '$carInformation'
          },
          {
            $unwind: '$ownerInformation'
          }
        ]).project(fieldsToProject).sort({ createdAt: 'desc' })
      } else {
        aggregatedDataToUse = await mongoose.models.CarShares.aggregate([
          { $match: query ? query : {} },
          {
            $lookup: {
              from: 'cars',
              localField: 'carId',
              foreignField: '_id',
              as: 'carInformation'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'ownerId',
              foreignField: '_id',
              as: 'ownerInformation'
            }
          },
          {
            $unwind: '$carInformation'
          },
          {
            $unwind: '$ownerInformation'
          }
        ]).project(fieldsToProject).sort({ createdAt: 'desc' })
      }

      res.status(200).send(aggregatedDataToUse)
    } catch (err) {
      next(err.message)
    }
  }

  async verifyCarExists(req: any, _res: Response, next: NextFunction) {
    const { carId } = req.body

    try {
      const document = await mongoose.models.Cars.findById(carId)
      if (document) {
        req.body.ownerId = new ObjectId(document.ownerId)
        next()
      } else {
        next(new NotFound(Exceptions.CAR_NOT_FOUND))
      }
    } catch (err) {
      next(new InternalServerError(err))
    }
  }
}