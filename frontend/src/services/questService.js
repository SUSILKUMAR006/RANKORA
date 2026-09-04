import api from './api.js'
import {
  completeQuest as localCompleteQuest,
  getStoredQuests,
  QUEST_STORAGE_KEY,
} from '../hooks/useQuestCompletion.js'
import { recordQuestFailure } from '../hooks/useQuestFailure.js'

export const questService = {
  /**
   * Fetch all daily quests from real MongoDB
   * @param {Object} [params]
   */
  async getQuests(params = {}) {
    try {
      const res = await api.get('/quests', { params })
      if (res?.quests && Array.isArray(res.quests)) {
        localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(res.quests))
        return res.quests
      }
      return getStoredQuests()
    } catch {
      return getStoredQuests()
    }
  },

  /**
   * Fetch single quest by ID
   * @param {string} id
   */
  async getQuestById(id) {
    try {
      const res = await api.get(`/quests/${id}`)
      return res?.quest || null
    } catch {
      const quests = getStoredQuests()
      return quests.find((q) => q.id === id || q._id === id) || null
    }
  },

  /**
   * Create custom quest in MongoDB
   * @param {Object} questData
   */
  async createQuest(questData) {
    try {
      const res = await api.post('/quests', questData)
      if (res?.quest) {
        const current = getStoredQuests()
        localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify([res.quest, ...current]))
        return res.quest
      }
      throw new Error('API failed')
    } catch {
      const current = getStoredQuests()
      const newQuest = {
        id: `quest-${Date.now()}`,
        status: 'pending',
        progress: 0,
        history: [],
        createdAt: new Date().toISOString(),
        ...questData,
      }
      const updated = [newQuest, ...current]
      localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(updated))
      return newQuest
    }
  },

  /**
   * Complete quest in MongoDB and receive XP/stat rewards
   * @param {string} id
   */
  async completeQuest(id) {
    try {
      const res = await api.post(`/quests/${id}/complete`)
      localCompleteQuest(id)
      return res
    } catch {
      return localCompleteQuest(id)
    }
  },

  /**
   * Log quest failure in MongoDB
   * @param {string} id
   * @param {{ reason: string, note?: string }} payload
   */
  async failQuest(id, payload) {
    try {
      const res = await api.post(`/quests/${id}/fail`, payload)
      recordQuestFailure(id, payload)
      return res
    } catch {
      return recordQuestFailure(id, payload)
    }
  },

  /**
   * Submit quest verification proof
   * @param {string} id
   * @param {Object} proofPayload
   */
  async verifyQuest(id, proofPayload) {
    try {
      const res = await api.post(`/quests/${id}/complete`, proofPayload)
      localCompleteQuest(id)
      return res
    } catch {
      return localCompleteQuest(id)
    }
  },
}

export default questService
