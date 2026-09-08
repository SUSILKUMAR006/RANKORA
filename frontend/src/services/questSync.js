import api from './api.js'
import { QUEST_STORAGE_KEY, QUEST_DATE_STORAGE_KEY, PLAYER_STORAGE_KEY } from '../hooks/useQuestCompletion.js'
import { getQuestIcon } from '../data/mockQuests.js'
import { mergeServerDailyLog } from '../utils/dailyLogUtils.js'

function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

function toLocalQuestShape(serverQuest) {
  return {
    ...serverQuest,
    id: serverQuest.questKey || serverQuest._id,
  }
}

// Pulls the authoritative quest roster + player from the backend and mirrors
// it into localStorage, so the server (not the browser clock) decides when a
// new day starts and what the streak/history look like.
export async function syncQuestsFromServer() {
  try {
    const [questsRes, meRes, historyRes] = await Promise.all([
      api.get('/quests'),
      api.get('/auth/me'),
      api.get('/quests/history', { params: { days: 90 } }).catch(() => null),
    ])

    if (Array.isArray(historyRes?.logs)) {
      mergeServerDailyLog(historyRes.logs)
    }

    if (Array.isArray(questsRes?.quests)) {
      const localShaped = questsRes.quests.map(toLocalQuestShape)
      localStorage.setItem(
        QUEST_STORAGE_KEY,
        JSON.stringify(localShaped.map((q) => { const { icon, ...rest } = q; return rest }))
      )
      localStorage.setItem(QUEST_DATE_STORAGE_KEY, todayKey())
    }

    if (meRes?.user) {
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(meRes.user))
    }

    window.dispatchEvent(new Event('rankora-player-updated'))
    window.dispatchEvent(new Event('rankora-workout-updated'))

    return {
      quests: Array.isArray(questsRes?.quests)
        ? questsRes.quests.map((q) => ({ ...toLocalQuestShape(q), icon: getQuestIcon(toLocalQuestShape(q)) }))
        : null,
      player: meRes?.user || null,
    }
  } catch {
    return { quests: null, player: null }
  }
}

export async function fetchDailyHistory(days = 30) {
  try {
    const res = await api.get('/quests/history', { params: { days } })
    return Array.isArray(res?.logs) ? res.logs : []
  } catch {
    return null
  }
}
