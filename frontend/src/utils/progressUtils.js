export const PROGRESS_STORAGE_KEY = 'rankora_progress_photos'

export function getStoredProgressPhotos() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY))
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export function saveProgressPhotos(photos) {
  try {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify(
        photos.map((photo) => {
          const stored = { ...photo }
          return stored
        })
      )
    )
  } catch {
    // ignore
  }
}

export function getJourneyStart(player) {
  return player?.journeyStartDate || player?.createdAt || new Date().toISOString()
}

export function getDayNumber(date, startDate) {
  try {
    const start = new Date(startDate || new Date())
    const target = new Date(date || new Date())
    start.setHours(0, 0, 0, 0)
    target.setHours(0, 0, 0, 0)
    const diff = Math.floor((target.getTime() - start.getTime()) / 86400000)
    return Math.max(1, diff + 1)
  } catch {
    return 1
  }
}

export function isFutureDate(value) {
  try {
    const selected = new Date(`${value}T23:59:59`)
    return selected > new Date()
  } catch {
    return false
  }
}

export function formatCheckpointDate(value) {
  if (!value) return 'Today'
  try {
    const rawDate = typeof value === 'string' && value.includes('T') ? value.split('T')[0] : String(value)
    const d = new Date(`${rawDate}T12:00:00`)
    if (isNaN(d.getTime())) {
      const fallback = new Date(value)
      if (!isNaN(fallback.getTime())) {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(fallback)
      }
      return 'Today'
    }
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d)
  } catch {
    return 'Today'
  }
}
