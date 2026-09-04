export const NOTIFICATIONS_STORAGE_KEY = 'rankora_notifications'

export const DEFAULT_NOTIFICATIONS = []

export function getStoredNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
    return []
  } catch {
    return []
  }
}

export function saveNotifications(notifications) {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
    window.dispatchEvent(new Event('rankora-notifications-updated'))
  } catch {
    // ignore
  }
}

export function addNotification(notification) {
  const current = getStoredNotifications()

  // Prevent Duplicate Notifications for the same event key
  if (notification.eventKey) {
    const exists = current.some((n) => n.eventKey === notification.eventKey)
    if (exists) return null
  }

  const newNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: notification.type || 'system',
    eventKey: notification.eventKey || null,
    title: notification.title || 'SYSTEM UPDATE',
    message: notification.message || '',
    tone: notification.tone || 'cyan', // 'emerald' | 'rose' | 'amber' | 'cyan' | 'violet'
    iconName: notification.iconName || 'Bell',
    link: notification.link || null,
    timestamp: new Date().toISOString(),
    isRead: false,
  }

  const updated = [newNotification, ...current].slice(0, 50)
  saveNotifications(updated)
  return newNotification
}

export function markAsRead(id) {
  const current = getStoredNotifications()
  const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n))
  saveNotifications(updated)
  return updated
}

export function markAllAsRead() {
  const current = getStoredNotifications()
  const updated = current.map((n) => ({ ...n, isRead: true }))
  saveNotifications(updated)
  return updated
}

export function deleteNotification(id) {
  const current = getStoredNotifications()
  const updated = current.filter((n) => n.id !== id && n._id !== id)
  saveNotifications(updated)
  return updated
}

export function clearAllNotifications() {
  saveNotifications([])
  return []
}

export function getUnreadCount(notifications = getStoredNotifications()) {
  return notifications.filter((n) => !n.isRead).length
}

export function formatRelativeTime(isoString) {
  if (!isoString) return 'Just now'
  try {
    const diffSeconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
    if (diffSeconds < 60) return 'Just now'
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`
    return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric' })
  } catch {
    return 'Recently'
  }
}
