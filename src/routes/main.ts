import { Router } from 'express'
import Validator from '../validators/main'
import Generic from '../controllers'
import { MainModel } from '../models/main'
import CRUD from './crud'

const v = new Validator()
const controller = new Generic(MainModel, ['title','logo'])
const crud = new CRUD('main', controller, v)
const router = crud.getRouter()

export default router