import { IRoute } from './IRoute';
import { Schema } from 'mongoose';

export interface IBaseRoute {
  setSchema(options: any): Schema
  setHandlers(): void
  create(): IRoute
}