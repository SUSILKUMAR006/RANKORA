import { fallbackPlayer, getStoredPlayer } from '../data/mockDashboardData.js'

export const SETTINGS_STORAGE_KEY = 'rankora_settings'
export const PLAYER_STORAGE_KEY = 'rankora_player'

export const DEFAULT_SETTINGS = {
  // Quest Defaults
  defaultDifficulty: 'Normal', // 'Easy' | 'Normal' | 'Hard'
  defaultQuestType: 'Mandatory', // 'Mandatory' | 'Optional'
  defaultVerification: 'None', // 'None' | 'Photo Required' | 'Photo + Reflection Note'

  // Notifications
  systemNotifications: true,
  achievementNotifications: true,
  bossNotifications: true,

  // Appearance
  theme: 'dark-cyberpunk', // 'dark-cyberpunk' (default) | 'deep-obsidian' | 'cyber-neon'
  glowEffects: true,
  soundEffects: true,

  // Privacy
  photosPrivate: true,
  diaryPrivate: true,
}

export function getStoredSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) {
      saveSettings(DEFAULT_SETTINGS)
      return DEFAULT_SETTINGS
    }
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    window.dispatchEvent(new Event('rankora-settings-updated'))
    return settings
  } catch {
    return settings
  }
}

export function updatePlayerProfile(updates) {
  try {
    const current = getStoredPlayer() || fallbackPlayer
    const updated = {
      ...current,
      ...updates,
      stats: {
        ...(current.stats || fallbackPlayer.stats),
        ...(updates.stats || {}),
      },
    }
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('rankora-player-updated'))
    return updated
  } catch {
    return fallbackPlayer
  }
}

export function exportAllRankoraData() {
  try {
    const keys = [
      'rankora_player',
      'rankora_mock_quests',
      'rankora_failures',
      'rankora_diary',
      'rankora_progress_photos',
      'rankora_achievements',
      'rankora_weekly_boss',
      'rankora_notifications',
      'rankora_settings',
    ]

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      systemVersion: 'RANKORA v1.0',
      data: {},
    }

    keys.forEach((key) => {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          exportPayload.data[key] = JSON.parse(item)
        }
      } catch {
        // if plain string
        exportPayload.data[key] = localStorage.getItem(key)
      }
    })

    const jsonString = JSON.stringify(exportPayload, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const dateStr = new Date().toISOString().slice(0, 10)
    link.href = url
    link.download = `rankora-backup-${dateStr}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return true
  } catch {
    return false
  }
}

export function clearAllRankoraData() {
  try {
    const keys = [
      'rankora_player',
      'rankora_mock_quests',
      'rankora_failures',
      'rankora_diary',
      'rankora_progress_photos',
      'rankora_achievements',
      'rankora_weekly_boss',
      'rankora_boss',
      'rankora_notifications',
      'rankora_settings',
    ]

    keys.forEach((key) => localStorage.removeItem(key))
    return true
  } catch {
    return false
  }
}
