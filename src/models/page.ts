import { Schema, model, Model, Document } from 'mongoose'

export interface Page extends Document {
  title: string
  url: string
  ayuntamiento: string
  type: string
}

const PageSchema = new Schema ({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
  },
  ayuntamiento: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    required: true
  }
}, {
  versionKey: false
})

PageSchema.pre('save', function(next) {
  this.url = this.title.toLowerCase().replace(/\s/g, '-').replace(/\W/g, '')
  next();
})

PageSchema.methods.toJSON = function() {
  let obj = this.toObject()
  delete obj.ayuntamiento
  return obj
}

export const PageModel: Model<Page> = model('Page', PageSchema)