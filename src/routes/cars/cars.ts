import { NextFunction, Request, Response } from 'express-serve-static-core';
import { models, Schema, SchemaOptions, SchemaTypes, Types } from 'mongoose';
import { userInformationDefintion } from '../../definitions/user-information/user-information.definition';
import { Method } from '../../enums/methods';
import { BaseRoute } from '../base-route';

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
      if (method.name === Method.GET) {
        method.handlers = [...method.handlers || [], this.aggregateData]
      }

      if (method.name === Method.POST) {
        method.handlers = [...method.handlers || [], this.verifyUserExists]
      }
    })
  }

  async aggregateData(req: Request, res: Response, next: NextFunction) {
    if (req.params.id) {
      next()
    }

    try {
      const aggregatedData = await models.Cars.aggregate([
        { $match: { ownerId: Types.ObjectId(req.query.ownerId) } },
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
        userInformation: userInformationDefintion,
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