import { Schema, model, Model, Document } from 'mongoose'

export interface Main extends Document {
  title: string
  logo: string
  ayuntamiento: string
  correo: string
  direccion: string
  telefono: string
  facebook: string
}

const MainSchema = new Schema ({
  title: {
    type: String,
    required: true
  },
  logo: {
    type: String,
  },
  ayuntamiento: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  correo: {
    type: String,
  },
  direccion: {
    type: String,
  },
  telefono: {
    type: String,
  },
  facebook: {
    type: String,
  },
}, {
  versionKey: false
})

MainSchema.methods.toJSON = function() {
  let obj = this.toObject()
  delete obj.ayuntamiento
  return obj
}

export const MainModel: Model<Main> = model('Main', MainSchema)