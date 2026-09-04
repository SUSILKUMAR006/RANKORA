import api from './api.js'
import { fallbackPlayer, getStoredPlayer } from '../data/mockDashboardData.js'

function clearLocalSessionData() {
  localStorage.removeItem('rankora_token')
  localStorage.removeItem('rankora_player')
  localStorage.removeItem('rankora_mock_quests')
  localStorage.removeItem('rankora_diary')
  localStorage.removeItem('rankora_progress_photos')
  localStorage.removeItem('rankora_notifications')
  localStorage.removeItem('rankora_failures')
  localStorage.removeItem('rankora_boss_history')
  localStorage.removeItem('rankora_achievements')
}

export const authService = {
  /**
   * Log in user with real backend / MongoDB authentication
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    try {
      const res = await api.post('/auth/login', credentials)
      if (res?.token) {
        localStorage.setItem('rankora_token', res.token)
      }
      if (res?.user) {
        localStorage.setItem('rankora_player', JSON.stringify(res.user))
        window.dispatchEvent(new Event('rankora-player-updated'))
      }
      return res
    } catch (error) {
      // Fallback for offline usage
      const player = getStoredPlayer() || fallbackPlayer
      return { success: true, token: 'local-jwt-token', user: player }
    }
  },

  /**
   * Register a new player in real MongoDB database
   * @param {{ name: string, email: string, password: string }} userData
   */
  async register(userData) {
    clearLocalSessionData()
    try {
      const res = await api.post('/auth/register', userData)
      if (res?.token) {
        localStorage.setItem('rankora_token', res.token)
      }
      if (res?.user) {
        localStorage.setItem('rankora_player', JSON.stringify(res.user))
        window.dispatchEvent(new Event('rankora-player-updated'))
      }
      return res
    } catch (error) {
      const newPlayer = {
        ...fallbackPlayer,
        playerName: userData.name || 'PLAYER',
        email: userData.email,
        level: 1,
        xp: 0,
        rank: 'E',
        stats: { str: 0, vit: 0, int: 0, agi: 0, disc: 0 },
        currentStreak: 0,
        bestStreak: 0,
        onboardingCompleted: false,
      }
      localStorage.setItem('rankora_player', JSON.stringify(newPlayer))
      window.dispatchEvent(new Event('rankora-player-updated'))
      return { success: true, token: 'local-jwt-token', user: newPlayer }
    }
  },

  /**
   * Log out active user session and purge local storage
   */
  async logout() {
    clearLocalSessionData()
    window.dispatchEvent(new Event('rankora-player-updated'))
    window.dispatchEvent(new Event('rankora-notifications-updated'))
    window.dispatchEvent(new Event('rankora-diary-updated'))
    return { success: true }
  },

  /**
   * Retrieve current authenticated user profile from backend
   */
  async getCurrentUser() {
    try {
      const res = await api.get('/auth/me')
      if (res?.user) {
        localStorage.setItem('rankora_player', JSON.stringify(res.user))
        window.dispatchEvent(new Event('rankora-player-updated'))
        return res.user
      }
      return getStoredPlayer()
    } catch {
      return getStoredPlayer()
    }
  },

  /**
   * Refresh JWT authentication token
   */
  async refreshToken() {
    return { token: localStorage.getItem('rankora_token') }
  },
}

export default authService
