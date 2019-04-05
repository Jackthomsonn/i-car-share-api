import { Model, Document } from "mongoose";

export interface IRoute {
  uri: string
  model: Model<Document>
  methods: any[]
  handlers: any[]
}