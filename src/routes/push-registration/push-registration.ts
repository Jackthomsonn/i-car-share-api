import { Schema, SchemaOptions } from 'mongoose';
import { BaseRoute } from '../base-route';

export class PushRegistrationRoute extends BaseRoute {
  constructor(uri: string, methods: any[]) {
    super(uri, methods)
  }

  setSchema(options: SchemaOptions) {
    return new Schema({
      registrationId: {
        type: String,
        required: true
      }
    }, options)
  }
}