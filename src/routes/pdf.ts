import { Router } from 'express'
import Uploader from '../controllers/upload'
import Middleware from '../middleware'

const m = new Middleware()

const controller = new Uploader('pdf', '/public/pdf','/pdf')
const router = Router()

router.route('/')
  .post(m.auth, controller.upload)

export default router