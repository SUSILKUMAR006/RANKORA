import express from 'express'
import {
  completeQuest,
  createQuest,
  deleteQuest,
  failQuest,
  getDailyLogHistory,
  getQuestById,
  getQuests,
} from '../controllers/questController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.get('/', getQuests)
router.post('/', createQuest)
router.get('/history', getDailyLogHistory)
router.get('/:id', getQuestById)
router.post('/:id/complete', completeQuest)
router.post('/:id/fail', failQuest)
router.delete('/:id', deleteQuest)

export default router
