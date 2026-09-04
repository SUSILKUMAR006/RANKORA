import express from 'express'
import { deleteProgressPhoto, getProgressPhotos, uploadProgressPhoto } from '../controllers/progressController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.get('/photos', getProgressPhotos)
router.post('/photos', uploadProgressPhoto)
router.delete('/photos/:id', deleteProgressPhoto)

export default router
