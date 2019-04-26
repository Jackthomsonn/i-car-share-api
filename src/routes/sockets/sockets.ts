import { NextFunction, Response } from 'express-serve-static-core';
import { models, Schema, SchemaOptions, Types } from 'mongoose';
import { Method } from '../../enums/methods';
import { BaseRoute } from '../base-route';

const { InternalServerError } = require('dynamic-route-generator')

export class SocketsRoute extends BaseRoute {
  constructor(uri: string, methods: any[]) {
    super(uri, methods)
  }

  setHandlers() {
    this.methods.forEach(method => {
      if (method.name === Method.POST) {
        method.handlers = [...method.handlers || [], this.verifySocketIsNotAlreadyRegisteredToUser]
      }
    });
  }

  setSchema(options: SchemaOptions) {
    return new Schema({
      socketId: {
        type: String,
        required: true
      },
      userId: {
        type: Types.ObjectId,
        required: true
      }
    }, options)
  }

  async verifySocketIsNotAlreadyRegisteredToUser(req: any, res: Response, next: NextFunction) {
    const { userId, socketId } = req.body

    try {
      const document: any = await models.Sockets.findOne({ userId: Types.ObjectId(userId) })
      if (!document) {
        next()
      } else {
        document.socketId = socketId;

        try {
          await document.save();

          res.status(200).send();
        } catch (error) {
          throw new InternalServerError(error);
        }
      }
    } catch (err) {
      next(new InternalServerError(err))
    }
  }
}