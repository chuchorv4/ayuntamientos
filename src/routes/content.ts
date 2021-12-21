import Validator from '../validators/content'
import { ContentModel } from '../models/content'
import Generic from '../controllers'
import CRUD from './crud'

const v = new Validator()
const controller = new Generic(ContentModel, ['content','page'])
const crud = new CRUD('pages', controller, v)
const router = crud.getRouter()

export default router