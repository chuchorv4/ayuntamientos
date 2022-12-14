import { Router } from 'express'
import auth from './auth'
import images from './images'
import pages from './pages'
import pdf from './pdf'
import content from './content'
import main from './main'

const router = Router()

router.use('/auth', auth)
router.use('/pages', pages)
router.use('/images', images)
router.use('/pdf', pdf)
router.use('/content', content)
router.use('/', main)

export default router