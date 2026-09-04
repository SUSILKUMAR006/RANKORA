import api from './api.js'
import {
  applyQuestDamageToBoss,
  claimBossDefeatReward,
  getStoredWeeklyBoss,
} from '../utils/bossUtils.js'

export const bossService = {
  /**
   * Fetch active weekly boss from MongoDB
   */
  async getCurrentBoss() {
    try {
      const res = await api.get('/boss/current')
      if (res?.boss) {
        return res.boss
      }
      return getStoredWeeklyBoss().currentBoss
    } catch {
      return getStoredWeeklyBoss().currentBoss
    }
  },

  /**
   * Attack weekly boss with completed quest strike in MongoDB
   * @param {Object} completedQuest
   * @param {string} questInstanceKey
   */
  async attackBoss(completedQuest, questInstanceKey) {
    try {
      const res = await api.post('/boss/attack', {
        questId: completedQuest.id || completedQuest._id,
        questTitle: completedQuest.title,
        damage: completedQuest.xp >= 50 ? 100 : completedQuest.xp >= 25 ? 50 : 30,
      })
      applyQuestDamageToBoss(completedQuest, questInstanceKey)
      return res
    } catch {
      return applyQuestDamageToBoss(completedQuest, questInstanceKey)
    }
  },

  /**
   * Fetch boss history from MongoDB
   */
  async getBossHistory() {
    try {
      const res = await api.get('/boss/history')
      return res?.history || getStoredWeeklyBoss().history || []
    } catch {
      return getStoredWeeklyBoss().history || []
    }
  },

  /**
   * Claim boss defeat +1,000 XP reward
   * @param {string} bossId
   */
  async claimBossReward(bossId) {
    try {
      return claimBossDefeatReward()
    } catch {
      return claimBossDefeatReward()
    }
  },
}

export default bossService
