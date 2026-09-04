import api from './api.js'
import {
  evaluateAchievements,
  getLatestUnlockedAchievement,
} from '../utils/achievementUtils.js'

export const achievementService = {
  /**
   * Fetch achievements evaluated against real player metrics
   */
  async getAchievements() {
    try {
      const res = await api.get('/achievements')
      if (res?.achievements && Array.isArray(res.achievements)) {
        return res.achievements
      }
      return evaluateAchievements().achievements
    } catch {
      return evaluateAchievements().achievements
    }
  },

  /**
   * Claim achievement in MongoDB
   * @param {string} id
   */
  async claimAchievement(id) {
    try {
      const res = await api.post(`/achievements/${id}/claim`)
      return res
    } catch {
      const result = evaluateAchievements()
      return { success: true, achievement: result.achievements.find((a) => a.id === id) }
    }
  },

  /**
   * Fetch achievement stats
   */
  async getAchievementStats() {
    return evaluateAchievements()
  },

  /**
   * Fetch latest unlocked achievement
   */
  async getLatestAchievement() {
    return getLatestUnlockedAchievement()
  },
}

export default achievementService
