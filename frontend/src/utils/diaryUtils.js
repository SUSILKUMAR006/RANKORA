import { addNotification } from './notificationUtils.js'

export const DIARY_STORAGE_KEY = 'rankora_diary'

export const DEFAULT_DIARY_ENTRIES = []

export function getStoredDiaryEntries() {
  try {
    const raw = localStorage.getItem(DIARY_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
    return []
  } catch {
    return []
  }
}

export function saveDiaryEntries(entries) {
  try {
    localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(entries))
    window.dispatchEvent(new Event('rankora-diary-updated'))
  } catch {
    // ignore
  }
}

export function addDiaryEntry(entry) {
  const current = getStoredDiaryEntries()
  const newEntry = {
    id: `diary-${Date.now()}`,
    date: entry.date || new Date().toISOString().slice(0, 10),
    title: entry.title || 'Daily Reflection',
    content: entry.content || '',
    mood: Number(entry.mood) || 4,
    energy: entry.energy || 'Focused',
    tags: Array.isArray(entry.tags) && entry.tags.length > 0 ? entry.tags : ['Discipline'],
    obstacle: entry.obstacle || '',
    keyWin: entry.keyWin || '',
    createdAt: new Date().toISOString(),
  }

  const updated = [newEntry, ...current]
  saveDiaryEntries(updated)

  // Trigger System Notification
  addNotification({
    type: 'system',
    eventKey: `diary-${newEntry.id}`,
    title: 'COGNITIVE LOG RECORDED',
    message: `Reflection "${newEntry.title}" inscribed in personal telemetry.`,
    tone: 'cyan',
    iconName: 'BookOpen',
    link: '/diary',
  })

  return newEntry
}

export function deleteDiaryEntry(id) {
  const current = getStoredDiaryEntries()
  const updated = current.filter((entry) => entry.id !== id && entry._id !== id)
  saveDiaryEntries(updated)
  return updated
}

export function formatDiaryDate(dateString) {
  if (!dateString) return 'Today'
  try {
    const d = new Date(`${dateString}T12:00:00`)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d)
  } catch {
    return dateString
  }
}

export function getDiarySummaryStats() {
  const entries = getStoredDiaryEntries()
  const totalEntries = entries.length
  const averageMood =
    totalEntries > 0
      ? (entries.reduce((acc, curr) => acc + (Number(curr.mood) || 4), 0) / totalEntries).toFixed(1)
      : '0.0'

  const allTags = entries.flatMap((e) => e.tags || [])
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {})

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag)

  return {
    totalEntries,
    averageMood,
    topTags: topTags.length > 0 ? topTags : ['None'],
  }
}
