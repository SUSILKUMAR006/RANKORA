import api from './api.js'
import { fallbackPlayer, getStoredPlayer } from '../data/mockDashboardData.js'
import { updatePlayerProfile } from '../utils/settingsUtils.js'

export const userService = {
  /**
   * Fetch player profile from real MongoDB database
   */
  async getProfile() {
    try {
      const res = await api.get('/users/profile')
      if (res?.user) {
        localStorage.setItem('rankora_player', JSON.stringify(res.user))
        window.dispatchEvent(new Event('rankora-player-updated'))
        return res.user
      }
      return getStoredPlayer() || fallbackPlayer
    } catch {
      return getStoredPlayer() || fallbackPlayer
    }
  },

  /**
   * Update player profile parameters in MongoDB
   * @param {Object} updates
   */
  async updateProfile(updates) {
    try {
      const res = await api.put('/users/profile', updates)
      if (res?.user) {
        localStorage.setItem('rankora_player', JSON.stringify(res.user))
        window.dispatchEvent(new Event('rankora-player-updated'))
        return res.user
      }
      return updatePlayerProfile(updates)
    } catch {
      return updatePlayerProfile(updates)
    }
  },

  /**
   * Fetch RPG attributes (STR, VIT, INT, AGI, DISC)
   */
  async getPlayerStats() {
    try {
      const res = await api.get('/users/stats')
      return res?.stats || (getStoredPlayer() || fallbackPlayer).stats
    } catch {
      const player = getStoredPlayer() || fallbackPlayer
      return player.stats || fallbackPlayer.stats
    }
  },

  /**
   * Update RPG attributes in MongoDB
   * @param {Object} stats
   */
  async updatePlayerStats(stats) {
    try {
      const res = await api.put('/users/stats', { stats })
      return res?.stats
    } catch {
      return updatePlayerProfile({ stats })
    }
  },
}

export default userService
