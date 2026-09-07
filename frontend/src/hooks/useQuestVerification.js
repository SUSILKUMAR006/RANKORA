import { useState } from 'react'
import { getStoredQuests, QUEST_STORAGE_KEY } from './useQuestCompletion.js'
import { normalizeVerificationType, saveVerificationMetadata } from '../utils/verificationUtils.js'

export function submitQuestVerification(questId, payload) {
  const quests = getStoredQuests()
  const targetId = String(questId || '').trim()
  const quest = quests.find(
    (item) =>
      (item.id && item.id === targetId) ||
      (item._id && item._id === targetId) ||
      (item.questKey && item.questKey === targetId)
  )
  if (!quest) return { error: 'Quest data could not be located.' }
  if (quest.status === 'pending_verification') return { alreadyPending: true, quest }
  if (normalizeVerificationType(quest.verification) === 'none') return { error: 'This quest does not require verification.' }
  const submittedAt = new Date().toISOString()
  const updatedQuest = { ...quest, status: 'pending_verification', verificationStatus: 'pending', verificationSubmittedAt: submittedAt, verificationNote: payload.note || '' }
  
  const matchedKey = String(quest.id || quest._id || quest.questKey || '').trim()
  const updatedQuests = quests.map((item) => {
    const isExactMatch =
      Boolean(quest.id && item.id && item.id === quest.id) ||
      Boolean(quest._id && item._id && item._id === quest._id) ||
      Boolean(quest.questKey && item.questKey && item.questKey === quest.questKey) ||
      Boolean(matchedKey && (item.id === matchedKey || item._id === matchedKey || item.questKey === matchedKey))
    const storedQuest = { ...(isExactMatch ? updatedQuest : item) }
    delete storedQuest.icon
    return storedQuest
  })
  localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(updatedQuests))
  const metadata = saveVerificationMetadata(quest, { ...payload, submittedAt })
  return { quest: updatedQuest, metadata }
}

export function useQuestVerification(questId) {
  const [state, setState] = useState({ status: 'idle' })
  const submit = (payload) => {
    const result = submitQuestVerification(questId, payload)
    if (result.quest) setState({ status: 'submitted', result })
    return result
  }
  return { ...state, submit }
}
