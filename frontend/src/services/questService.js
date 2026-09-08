import api, { formatApiError } from './api.js'
import {
  completeQuest as localCompleteQuest,
  getStoredQuests,
  QUEST_STORAGE_KEY,
} from '../hooks/useQuestCompletion.js'
import { recordQuestFailure } from '../hooks/useQuestFailure.js'

export const questService = {
  /**
   * Fetch all daily quests from real MongoDB. Throws on failure — callers
   * decide how to surface it, no silent local fallback.
   * @param {Object} [params]
   */
  async getQuests(params = {}) {
    const res = await api.get('/quests', { params })
    const quests = Array.isArray(res?.quests) ? res.quests : []
    localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(quests))
    return quests
  },

  /**
   * Fetch single quest by ID
   * @param {string} id
   */
  async getQuestById(id) {
    const res = await api.get(`/quests/${id}`)
    return res?.quest || null
  },

  /**
   * Create custom quest in MongoDB
   * @param {Object} questData
   */
  async createQuest(questData) {
    const res = await api.post('/quests', questData)
    if (!res?.quest) throw new Error('Quest creation failed: no quest returned by server.')
    const current = getStoredQuests()
    localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify([res.quest, ...current]))
    return res.quest
  },

  /**
   * Complete quest in MongoDB and receive XP/stat rewards. The database is
   * authoritative: the write must succeed before the local mirror (which
   * drives XP animations, boss damage, achievements) is updated. On failure
   * the error propagates and local state is left untouched.
   * @param {string} id
   * @param {Object} [options]
   */
  async completeQuest(id, options = {}) {
    try {
      const server = await api.post(`/quests/${id}/complete`, options)
      const localResult = localCompleteQuest(id, options)
      return { ...localResult, server }
    } catch (error) {
      throw new Error(formatApiError(error))
    }
  },

  /**
   * Log quest failure in MongoDB
   * @param {string} id
   * @param {{ reason: string, note?: string }} payload
   */
  async failQuest(id, payload) {
    try {
      const server = await api.post(`/quests/${id}/fail`, payload)
      const localResult = recordQuestFailure(id, payload)
      return { ...localResult, server }
    } catch (error) {
      throw new Error(formatApiError(error))
    }
  },

  /**
   * Submit quest verification proof
   * @param {string} id
   * @param {Object} proofPayload
   */
  async verifyQuest(id, proofPayload = {}) {
    try {
      const server = await api.post(`/quests/${id}/complete`, proofPayload)
      const localResult = localCompleteQuest(id, { bypassVerification: true, proof: proofPayload })
      return { ...localResult, server }
    } catch (error) {
      throw new Error(formatApiError(error))
    }
  },
}

export default questService
