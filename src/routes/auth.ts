import { Router } from 'express'
import Auth from '../controllers/auth'
import Middleware from '../middleware'
import Validator from '../validators/user'

const m = new Middleware()
const a = new Auth()
const v = new Validator()
const router = Router()

router.route('/login')
  .post([v.login, m.password], a.login)

router.route('/user')
  .get(m.auth, a.user)

router.route('/logout')
  .post(m.auth, a.logout)

export default router
