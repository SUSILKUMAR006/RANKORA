import express from 'express'
import { attackBoss, getBossHistory, getCurrentBoss } from '../controllers/bossController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.get('/current', getCurrentBoss)
router.post('/attack', attackBoss)
router.get('/history', getBossHistory)

export default router
