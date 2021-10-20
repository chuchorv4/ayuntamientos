import { Schema, model, Model, Document } from 'mongoose'

export interface Contact extends Document {
  name: string
  address: string
  phone: string
  order: number
  job: string
  picture: string
  email: string
  ayuntamiento: string
}

const ContactSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  order: {
    type: Number,
    required: true
  },
  job: {
    type: String,
    required: true
  },
  picture: {
    type: String
  },
  email: {
    type: String
  },
  ayuntamiento: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  }
}, {
  versionKey: false
})

ContactSchema.methods.toJSON = function() {
 let obj = this.toObject()
 delete obj.ayuntamiento
 return obj
}

export const ContactModel: Model<Contact> = model('Contact', ContactSchema)