import api, { formatApiError } from './api.js'

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
      // No silent local fallback: a fake session here previously let the app
      // run entirely on stale localStorage for days without anyone noticing
      // the backend was unreachable. Surface the real failure instead.
      throw new Error(formatApiError(error))
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
      throw new Error(formatApiError(error))
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
    const res = await api.get('/auth/me')
    if (res?.user) {
      localStorage.setItem('rankora_player', JSON.stringify(res.user))
      window.dispatchEvent(new Event('rankora-player-updated'))
      return res.user
    }
    return null
  },

  /**
   * Refresh JWT authentication token
   */
  async refreshToken() {
    return { token: localStorage.getItem('rankora_token') }
  },
}

export default authService
