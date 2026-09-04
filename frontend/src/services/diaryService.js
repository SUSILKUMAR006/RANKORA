import api from './api.js'
import {
  addDiaryEntry,
  deleteDiaryEntry,
  getStoredDiaryEntries,
} from '../utils/diaryUtils.js'

export const diaryService = {
  /**
   * Fetch diary reflections from MongoDB
   * @param {Object} [params]
   */
  async getDiaryEntries(params = {}) {
    try {
      const res = await api.get('/diary', { params })
      if (res?.entries && Array.isArray(res.entries)) {
        localStorage.setItem('rankora_diary', JSON.stringify(res.entries))
        return res.entries
      }
      return getStoredDiaryEntries()
    } catch {
      return getStoredDiaryEntries()
    }
  },

  /**
   * Fetch single diary entry by ID
   * @param {string} id
   */
  async getDiaryEntryById(id) {
    try {
      const entries = await this.getDiaryEntries()
      return entries.find((e) => e.id === id || e._id === id) || null
    } catch {
      const entries = getStoredDiaryEntries()
      return entries.find((e) => e.id === id || e._id === id) || null
    }
  },

  /**
   * Save reflection to MongoDB
   * @param {Object} entryData
   */
  async createDiaryEntry(entryData) {
    try {
      const res = await api.post('/diary', entryData)
      addDiaryEntry(entryData)
      return res?.entry || entryData
    } catch {
      return addDiaryEntry(entryData)
    }
  },

  /**
   * Update reflection in MongoDB
   * @param {string} id
   * @param {Object} updates
   */
  async updateDiaryEntry(id, updates) {
    try {
      const res = await api.put(`/diary/${id}`, updates)
      return res?.entry
    } catch {
      const current = getStoredDiaryEntries()
      const updated = current.map((e) => (e.id === id ? { ...e, ...updates } : e))
      localStorage.setItem('rankora_diary', JSON.stringify(updated))
      return updated.find((e) => e.id === id)
    }
  },

  /**
   * Delete reflection from MongoDB
   * @param {string} id
   */
  async deleteDiaryEntry(id) {
    try {
      await api.delete(`/diary/${id}`)
      deleteDiaryEntry(id)
      return { success: true }
    } catch {
      return deleteDiaryEntry(id)
    }
  },
}

export default diaryService
