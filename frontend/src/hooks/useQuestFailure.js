import { useState } from 'react'
import { getStoredQuests, QUEST_STORAGE_KEY } from './useQuestCompletion.js'
import { getStoredFailures, FAILURE_STORAGE_KEY } from '../utils/failureUtils.js'
import { addNotification } from '../utils/notificationUtils.js'

function persistQuests(quests) {
  localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(quests.map((item) => { const quest = { ...item }; delete quest.icon; return quest })))
}

export function recordQuestFailure(questId, { reason, note = '' }) {
  const quests = getStoredQuests()
  const targetId = String(questId || '').trim()
  const quest = quests.find(
    (item) =>
      (item.id && item.id === targetId) ||
      (item._id && item._id === targetId) ||
      (item.questKey && item.questKey === targetId)
  )
  if (!quest) return { error: 'Quest data could not be located.' }
  if (quest.status === 'completed') return { error: 'Completed quests cannot be marked as failed.', alreadyFinal: true }
  if (quest.status === 'pending_verification') return { error: 'Verification is still in progress.', blocked: true }
  if (quest.status === 'failed' && quest.failureDate === new Date().toISOString().slice(0, 10)) return { quest, alreadyFailed: true }

  const failedAt = new Date()
  const failure = { id: `failure-${Date.now()}`, questId: quest.id || targetId, reason, note, failedAt: failedAt.toISOString(), date: failedAt.toISOString().slice(0, 10) }
  const failedQuest = { ...quest, status: 'failed', failureReason: reason, failureNote: note, failedAt: failure.failedAt, failureDate: failure.date, history: [{ date: 'Today', time: failedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), status: 'FAILED', reason, note, xp: 0 }, ...quest.history] }
  
  const matchedKey = String(quest.id || quest._id || quest.questKey || '').trim()
  const updatedQuests = quests.map((item) => {
    const isExactMatch =
      Boolean(quest.id && item.id && item.id === quest.id) ||
      Boolean(quest._id && item._id && item._id === quest._id) ||
      Boolean(quest.questKey && item.questKey && item.questKey === quest.questKey) ||
      Boolean(matchedKey && (item.id === matchedKey || item._id === matchedKey || item.questKey === matchedKey))
    return isExactMatch ? failedQuest : item
  })
  persistQuests(updatedQuests)
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
