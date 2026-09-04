import express from 'express'
import { getProfile, getStats, updateProfile, updateStats } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.get('/stats', getStats)
router.put('/stats', updateStats)

export default router
