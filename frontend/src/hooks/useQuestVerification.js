import { useState } from 'react'
import { getStoredQuests, QUEST_STORAGE_KEY } from './useQuestCompletion.js'
import { normalizeVerificationType, saveVerificationMetadata } from '../utils/verificationUtils.js'

export function submitQuestVerification(questId, payload) {
  const quests = getStoredQuests()
  const quest = quests.find((item) => item.id === questId)
  if (!quest) return { error: 'Quest data could not be located.' }
  if (quest.status === 'pending_verification') return { alreadyPending: true, quest }
  if (normalizeVerificationType(quest.verification) === 'none') return { error: 'This quest does not require verification.' }
  const submittedAt = new Date().toISOString()
  const updatedQuest = { ...quest, status: 'pending_verification', verificationStatus: 'pending', verificationSubmittedAt: submittedAt, verificationNote: payload.note || '' }
  localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(quests.map((item) => { const storedQuest = { ...(item.id === questId ? updatedQuest : item) }; delete storedQuest.icon; return storedQuest })))
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
