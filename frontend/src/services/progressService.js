import api from './api.js'
import {
  getStoredProgressPhotos,
  saveProgressPhotos,
} from '../utils/progressUtils.js'

export const progressService = {
  /**
   * Fetch all progress checkpoints from MongoDB
   */
  async getProgressPhotos() {
    try {
      const res = await api.get('/progress/photos')
      if (res?.photos && Array.isArray(res.photos)) {
        saveProgressPhotos(res.photos)
        return res.photos
      }
      return getStoredProgressPhotos()
    } catch {
      return getStoredProgressPhotos()
    }
  },

  /**
   * Upload progress photo to MongoDB
   * @param {Object} photoData
   */
  async uploadProgressPhoto(photoData) {
    try {
      const res = await api.post('/progress/photos', photoData)
      const current = getStoredProgressPhotos()
      const newPhoto = res?.photo || {
        id: `photo-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        ...photoData,
      }
      saveProgressPhotos([newPhoto, ...current])
      return newPhoto
    } catch {
      const current = getStoredProgressPhotos()
      const newPhoto = {
        id: `photo-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        ...photoData,
      }
      saveProgressPhotos([newPhoto, ...current])
      return newPhoto
    }
  },

  /**
   * Delete progress photo from MongoDB
   * @param {string} id
   */
  async deleteProgressPhoto(id) {
    try {
      await api.delete(`/progress/photos/${id}`)
      const current = getStoredProgressPhotos()
      saveProgressPhotos(current.filter((p) => p.id !== id && p._id !== id))
      return { success: true }
    } catch {
      const current = getStoredProgressPhotos()
      saveProgressPhotos(current.filter((p) => p.id !== id && p._id !== id))
      return { success: true }
    }
  },

  /**
   * Fetch weight history
   */
  async getWeightHistory() {
    const photos = await this.getProgressPhotos()
    return photos.filter((p) => p.weight).map((p) => ({ date: p.date, weight: p.weight }))
  },
}

export default progressService
