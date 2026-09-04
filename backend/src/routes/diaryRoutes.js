import express from 'express'
import {
  createDiaryEntry,
  deleteDiaryEntry,
  getDiaryEntries,
  updateDiaryEntry,
} from '../controllers/diaryController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.get('/', getDiaryEntries)
router.post('/', createDiaryEntry)
router.put('/:id', updateDiaryEntry)
router.delete('/:id', deleteDiaryEntry)

export default router
