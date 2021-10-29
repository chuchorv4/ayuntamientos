import { Schema, model, Model, Document } from 'mongoose'

export interface Content extends Document {
  content: string
  page: Schema.Types.ObjectId
}

const ContentSchema = new Schema ({
  content: {
    type: String,
    required: true
  },
  page: {
    type: Schema.Types.ObjectId,
    ref: 'Page',
    required: true
  }
}, {
  versionKey: false
})

ContentSchema.methods.toJSON = function() {
  let obj = this.toObject()
  delete obj.ayuntamiento
  return obj
}

export const ContentModel: Model<Content> = model('Content', ContentSchema)