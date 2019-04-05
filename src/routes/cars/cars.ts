import { BaseRoute } from '../base-route';
import { Schema, SchemaOptions, Types } from 'mongoose';
import { SchemaTypes } from 'mongoose'
import { Request, Response, NextFunction } from 'express-serve-static-core';
import mongoose from 'mongoose'

export class CarsRoute extends BaseRoute {
  constructor(uri: string, methods: any[]) {
    super(uri, methods)
  }

  setSchema(options: SchemaOptions) {
    return new Schema({
      make: {
        type: SchemaTypes.String,
        required: true
      },
      reg: {
        type: SchemaTypes.String,
        required: true
      },
      ownerId: {
        type: Types.ObjectId,
        required: true
      },
      rules: {
        type: SchemaTypes.Array,
        required: false
      },
      passengers: {
        type: SchemaTypes.Number,
        required: true
      }
    }, options)
  }

  setHandlers() {
    this.methods.forEach(method => {
      if (method.name === 'get') {
        method.handlers = [...method.handlers || [], this.aggregateData]
      }

      if (method.name === 'post') {
        method.handlers = [...method.handlers || [], this.verifyUserExists]
      }
    })
  }

  async aggregateData(req: Request, res: Response, next: NextFunction) {
    if (req.params.id) {
      next()
    }

    try {
      const aggregatedData = await mongoose.models.Cars.aggregate([
        { $match: { ownerId: mongoose.Types.ObjectId(req.query.ownerId) } },
        {
          $lookup: {
            from: 'users',
            localField: 'ownerId',
            foreignField: '_id',
            as: 'userInformation'
          }
        },
        {
          $unwind: '$userInformation'
        }
      ]).project({
        make: 1,
        reg: 1,
        rules: 1,
        ownerId: 1,
        userInformation: {
          _id: 1,
          username: 1
        },
        passengers: 1,
        createdAt: 1,
        updatedAt: 1
      })

      res.status(200).send(aggregatedData)
    } catch (err) {
      next(err.message)
    }
  }
}