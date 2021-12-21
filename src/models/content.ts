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
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  ayuntamiento: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
}, {
  versionKey: false
})

ContentSchema.methods.toJSON = function() {
  let obj = this.toObject()
  delete obj.ayuntamiento
  return obj
}

export const ContentModel: Model<Content> = model('Content', ContentSchema)