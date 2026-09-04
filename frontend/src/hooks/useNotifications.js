import { useCallback, useEffect, useState } from 'react'
import {
  NOTIFICATIONS_STORAGE_KEY,
  clearAllNotifications,
  deleteNotification,
  getStoredNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from '../utils/notificationUtils.js'

export function useNotifications() {
  const [notifications, setNotifications] = useState(() => getStoredNotifications())
  const [filter, setFilter] = useState('all') // 'all' | 'unread'

  const refresh = useCallback(() => {
    const updated = getStoredNotifications()
    setNotifications(updated)
    return updated
  }, [])

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === NOTIFICATIONS_STORAGE_KEY) {
        refresh()
      }
    }

    const handleCustomUpdate = () => {
      refresh()
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('rankora-notifications-updated', handleCustomUpdate)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('rankora-notifications-updated', handleCustomUpdate)
    }
  }, [refresh])

  const handleMarkAsRead = useCallback((id) => {
    const updated = markAsRead(id)
    setNotifications(updated)
  }, [])

  const handleMarkAllAsRead = useCallback(() => {
    const updated = markAllAsRead()
    setNotifications(updated)
  }, [])

  const handleDelete = useCallback((id) => {
    const updated = deleteNotification(id)
    setNotifications(updated)
  }, [])

  const handleClearAll = useCallback(() => {
    const updated = clearAllNotifications()
    setNotifications(updated)
  }, [])

  const unreadCount = getUnreadCount(notifications)

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead
    return true
  })

  return {
    notifications: filteredNotifications,
    allNotifications: notifications,
    unreadCount,
    filter,
    setFilter,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDelete,
    clearAll: handleClearAll,
    refresh,
  }
}
