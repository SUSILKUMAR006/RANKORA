import api from './api.js'
import {
  clearAllNotifications as localClearAll,
  deleteNotification as localDelete,
  getStoredNotifications,
  markAllAsRead as localMarkAll,
  markAsRead as localMarkRead,
} from '../utils/notificationUtils.js'

export const notificationService = {
  /**
   * Fetch notifications from MongoDB
   */
  async getNotifications() {
    try {
      const res = await api.get('/notifications')
      if (res?.notifications && Array.isArray(res.notifications)) {
        localStorage.setItem('rankora_notifications', JSON.stringify(res.notifications))
        return res.notifications
      }
      return getStoredNotifications()
    } catch {
      return getStoredNotifications()
    }
  },

  /**
   * Mark single notification as read
   * @param {string} id
   */
  async markAsRead(id) {
    try {
      await api.put(`/notifications/${id}/read`)
      return localMarkRead(id)
    } catch {
      return localMarkRead(id)
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      await api.put('/notifications/read-all')
      return localMarkAll()
    } catch {
      return localMarkAll()
    }
  },

  /**
   * Delete notification
   * @param {string} id
   */
  async deleteNotification(id) {
    try {
      await api.delete(`/notifications/${id}`)
      return localDelete(id)
    } catch {
      return localDelete(id)
    }
  },

  /**
   * Clear all notifications
   */
  async clearAllNotifications() {
    try {
      await api.delete('/notifications')
      return localClearAll()
    } catch {
      return localClearAll()
    }
  },
}

export default notificationService
