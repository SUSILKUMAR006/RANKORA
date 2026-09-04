import express from 'express'
import { claimAchievement, getAchievements } from '../controllers/achievementController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.get('/', getAchievements)
router.post('/:achievementId/claim', claimAchievement)

export default router
