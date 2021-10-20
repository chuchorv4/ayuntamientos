import Validator from '../validators/page'
import { PageModel } from '../models/page'
import Generic from '../controllers'
import CRUD from './crud'

const v = new Validator()
const controller = new Generic(PageModel, ['title','type','content'])
const crud = new CRUD('pages', controller, v)
const router = crud.getRouter()

export default router