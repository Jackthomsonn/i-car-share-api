import { NextFunction, Request, Response } from 'express-serve-static-core';
import { models, Schema, SchemaOptions, Types } from 'mongoose';
import { userInformationDefintion } from '../../definitions/user-information/user-information.definition';
import { Method } from '../../enums/methods';
import { BaseRoute } from '../base-route';

export class MessagesRoute extends BaseRoute {
  constructor(uri: string, methods: any[]) {
    super(uri, methods)
  }

  setHandlers() {
    this.methods.forEach(method => {
      if (method.name === Method.GET) {
        method.handlers = [...method.handlers || [], this.verifyRequestIsForUser, this.groupMessages];
      }
    });
  }

  async groupMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const groupedMessages = await models.Messages.aggregate(
        [
          {
            $match: {
              $or: [
                { recieverId: Types.ObjectId(req.query.senderId) },
                { senderId: Types.ObjectId(req.query.senderId) }
              ]
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'senderId',
              foreignField: '_id',
              as: 'sender'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'recieverId',
              foreignField: '_id',
              as: 'reciever'
            }
          },
          {
            $group: {
              _id: {
                recieverId: {
                  $cond: [{
                    $eq: ["$senderId", Types.ObjectId(req.query.senderId)]
                  }, "$recieverId", "$senderId"]
                }
              },
              carShareId: {
                $first: '$carShareId',
              },
              originalSender: {
                $first: {
                  $arrayElemAt: ["$sender", 0]
                }
              },
              originalReciever: {
                $first: {
                  $arrayElemAt: ["$reciever", 0]
                }
              },
              lastMessage: {
                $last: '$message',
              },
              messages: {
                $push: {
                  sender: {
                    _id: {
                      $arrayElemAt: ["$sender._id", 0]
                    }
                  },
                  reciever: {
                    _id: {
                      $arrayElemAt: ["$reciever._id", 0]
                    }
                  },
                  message: "$message"
                }
              },
              count: { $sum: 1 }
            }
          }
        ]).project({
          _id: 0,
          carShareId: 1,
          originalSender: userInformationDefintion,
          originalReciever: userInformationDefintion,
          lastMessage: 1,
          messages: {
            // sender: userInformationDefintion,
            // reciever: userInformationDefintion,
            // message: 1,
            $slice: ['$messages', -100]
          }
        });

      res.status(200).send(groupedMessages)
    } catch (err) {
      next(err.message)
    }
  }

  setSchema(options: SchemaOptions) {
    return new Schema({
      senderId: {
        type: Types.ObjectId,
        required: true
      },
      carShareId: {
        type: Types.ObjectId,
        required: true
      },
      recieverId: {
        type: Types.ObjectId,
        required: true
      },
      message: {
        type: String,
        required: true
      }
    }, options)
  }
}