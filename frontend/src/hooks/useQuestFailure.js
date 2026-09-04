import { useState } from 'react'
import { getStoredQuests, QUEST_STORAGE_KEY } from './useQuestCompletion.js'
import { getStoredFailures, FAILURE_STORAGE_KEY } from '../utils/failureUtils.js'
import { addNotification } from '../utils/notificationUtils.js'

function persistQuests(quests) {
  localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(quests.map((item) => { const quest = { ...item }; delete quest.icon; return quest })))
}

export function recordQuestFailure(questId, { reason, note = '' }) {
  const quests = getStoredQuests()
  const quest = quests.find((item) => item.id === questId)
  if (!quest) return { error: 'Quest data could not be located.' }
  if (quest.status === 'completed') return { error: 'Completed quests cannot be marked as failed.', alreadyFinal: true }
  if (quest.status === 'pending_verification') return { error: 'Verification is still in progress.', blocked: true }
  if (quest.status === 'failed' && quest.failureDate === new Date().toISOString().slice(0, 10)) return { quest, alreadyFailed: true }

  const failedAt = new Date()
  const failure = { id: `failure-${Date.now()}`, questId, reason, note, failedAt: failedAt.toISOString(), date: failedAt.toISOString().slice(0, 10) }
  const failedQuest = { ...quest, status: 'failed', failureReason: reason, failureNote: note, failedAt: failure.failedAt, failureDate: failure.date, history: [{ date: 'Today', time: failedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), status: 'FAILED', reason, note, xp: 0 }, ...quest.history] }
  persistQuests(quests.map((item) => item.id === questId ? failedQuest : item))
  localStorage.setItem(FAILURE_STORAGE_KEY, JSON.stringify([...getStoredFailures(), failure]))

  // Trigger Notification
  addNotification({
    type: 'quest_failed',
    eventKey: `quest-failed-${questId}-${failure.date}`,
    title: 'MISSION FAILED',
    message: `${quest.title} logged as failed (${reason || 'Obstacle Encountered'}). Telemetry stored.`,
    tone: 'rose',
    iconName: 'XCircle',
    link: `/quests/${questId}`,
  })

  return { quest: failedQuest, failure }
}

export function useQuestFailure(questId) {
  const [state, setState] = useState({ status: 'idle' })
  const record = (payload) => {
    const result = recordQuestFailure(questId, payload)
    if (result.quest) setState({ status: 'recorded', result })
    return result
  }
  return { ...state, record }
}
