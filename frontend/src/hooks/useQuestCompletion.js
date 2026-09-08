import { useState } from 'react'
import { fallbackPlayer, getStoredPlayer } from '../data/mockDashboardData.js'
import { defaultRoutineQuests, getQuestIcon } from '../data/mockQuests.js'
import { applyXpReward, applyStreakUpdate, parseStatReward } from '../utils/xpUtils.js'
import { evaluateAchievements } from '../utils/achievementUtils.js'
import { applyQuestDamageToBoss } from '../utils/bossUtils.js'
import { addNotification } from '../utils/notificationUtils.js'
import { formatStatReward } from '../utils/xpUtils.js'
import { recordDailyCompletion } from '../utils/dailyLogUtils.js'

export const QUEST_STORAGE_KEY = 'rankora_mock_quests'
export const QUEST_DATE_STORAGE_KEY = 'rankora_quests_date'
export const PLAYER_STORAGE_KEY = 'rankora_player'

function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

function persistQuests(quests) {
  try {
    localStorage.setItem(
      QUEST_STORAGE_KEY,
      JSON.stringify(
        quests.map((quest) => {
          const storedQuest = { ...quest }
          delete storedQuest.icon
          return storedQuest
        })
      )
    )
  } catch {
    // ignore
  }
}

export function sanitizeAndRestoreQuests(savedQuests) {
  if (!Array.isArray(savedQuests) || savedQuests.length === 0) {
    persistQuests(defaultRoutineQuests)
    return defaultRoutineQuests.map((quest) => ({
      ...quest,
      icon: getQuestIcon(quest),
    }))
  }

  // Count how many copies of gym-workout or identically titled quests exist
  const gymCopies = savedQuests.filter(
    (q) =>
      q?.id === 'gym-workout' ||
      q?.questKey === 'gym-workout' ||
      String(q?.title || '').trim().toLowerCase() === 'gym workout'
  )
  const hasDuplicateGyms = gymCopies.length > 1

  // Check unique IDs/titles
  const uniqueKeys = new Set(
    savedQuests.map((q) => q?.id || q?._id || q?.questKey || q?.title).filter(Boolean)
  )
  const isCorrupted = hasDuplicateGyms || uniqueKeys.size < Math.min(savedQuests.length, 3)

  if (isCorrupted) {
    // Preserve any legitimate custom quests created by the user
    const customUserQuests = savedQuests.filter((q) => {
      const qId = String(q?.id || q?._id || q?.questKey || '')
      const isDefault = defaultRoutineQuests.some(
        (def) => def.id === qId || def.questKey === qId || def.title === q?.title
      )
      return !isDefault && qId.startsWith('custom-quest-')
    })

    // Find if gym workout was completed so we retain that progress
    const gymCompletedItem = gymCopies.find((q) => q.status === 'completed')
    const completedProof = gymCompletedItem?.verificationProof || null
    const gymHistory = gymCompletedItem?.history || []

    const healedDefaults = defaultRoutineQuests.map((def) => {
      if (def.id === 'gym-workout' && gymCompletedItem) {
        return {
          ...def,
          status: 'completed',
          completedAt: gymCompletedItem.completedAt || new Date().toISOString(),
          verificationProof: completedProof,
          history: gymHistory,
        }
      }
      return { ...def }
    })

    const healedList = [...customUserQuests, ...healedDefaults]
    persistQuests(healedList)
    return healedList.map((quest) => ({
      ...quest,
      icon: getQuestIcon(quest),
    }))
  }

  // Deduplicate list in case of any duplicate keys
  const seen = new Set()
  const deduped = []
  for (const q of savedQuests) {
    const key = q?.id || q?._id || q?.questKey || q?.title
    if (key && !seen.has(key)) {
      seen.add(key)
      deduped.push(q)
    }
  }

  // Ensure all standard default routine quests exist in the roster
  let modified = false
  const completeList = [...deduped]
  for (const def of defaultRoutineQuests) {
    const exists = completeList.some(
      (q) => q.id === def.id || q.questKey === def.id || q.title === def.title
    )
    if (!exists) {
      completeList.push({ ...def })
      modified = true
    }
  }

  if (modified) {
    persistQuests(completeList)
  }

  return completeList.map((quest) => ({
    ...quest,
    icon: getQuestIcon(quest),
  }))
}

function resetQuestsForNewDay(previousQuests, now = new Date()) {
  if (previousQuests.length > 0) {
    recordDailyCompletion(previousQuests, new Date(now.getTime() - 24 * 60 * 60 * 1000))
  }
  const freshDefaults = defaultRoutineQuests.map((q) => ({
    ...q,
    status: 'pending',
    progress: 0,
    history: [],
    verificationProof: null,
  }))
  persistQuests(freshDefaults)
  localStorage.setItem(QUEST_DATE_STORAGE_KEY, todayKey(now))
  return freshDefaults
}

export function getStoredQuests() {
  const now = new Date()
  try {
    const raw = localStorage.getItem(QUEST_STORAGE_KEY)
    const storedDateKey = localStorage.getItem(QUEST_DATE_STORAGE_KEY)

    if (!raw) {
      persistQuests(defaultRoutineQuests)
      localStorage.setItem(QUEST_DATE_STORAGE_KEY, todayKey(now))
      return defaultRoutineQuests.map((quest) => ({
        ...quest,
        icon: getQuestIcon(quest),
      }))
    }

    const saved = JSON.parse(raw)
    const restored = sanitizeAndRestoreQuests(saved)

    if (storedDateKey && storedDateKey !== todayKey(now)) {
      const reset = resetQuestsForNewDay(restored, now)
      return reset.map((quest) => ({ ...quest, icon: getQuestIcon(quest) }))
    }

    if (!storedDateKey) {
      localStorage.setItem(QUEST_DATE_STORAGE_KEY, todayKey(now))
    }

    return restored
  } catch {
    return defaultRoutineQuests.map((quest) => ({
      ...quest,
      icon: getQuestIcon(quest),
    }))
  }
}

export function restoreDefaultQuests() {
  const freshDefaults = defaultRoutineQuests.map((q) => ({
    ...q,
    status: 'pending',
    progress: 0,
    history: [],
    verificationProof: null,
  }))
  persistQuests(freshDefaults)
  localStorage.setItem(QUEST_DATE_STORAGE_KEY, todayKey())
  window.dispatchEvent(new Event('storage'))
  window.dispatchEvent(new Event('rankora-player-updated'))
  window.dispatchEvent(new Event('rankora-workout-updated'))
  return freshDefaults.map((q) => ({ ...q, icon: getQuestIcon(q) }))
}

function getPlayer() {
  const stored = getStoredPlayer()
  return { ...fallbackPlayer, ...stored, stats: { ...fallbackPlayer.stats, ...(stored.stats || {}) } }
}

export function syncStreakForToday() {
  const quests = getStoredQuests()
  if (quests.length === 0 || !quests.every((item) => item.status === 'completed')) {
    return getPlayer()
  }

  const player = getPlayer()
  const now = new Date()
  const todayKey = now.toISOString().slice(0, 10)
  if (player.lastStreakDate === todayKey) {
    return player
  }

  const updatedPlayer = applyStreakUpdate(player, now)
  localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(updatedPlayer))
  window.dispatchEvent(new Event('rankora-player-updated'))
  return updatedPlayer
}

export function completeQuest(questId, options = {}) {
  const quests = getStoredQuests()
  const targetId = String(questId || '').trim()

  let quest = quests.find(
    (item) =>
      (item.id && item.id === targetId) ||
      (item._id && item._id === targetId) ||
      (item.questKey && item.questKey === targetId)
  )

  if (!quest && (targetId === 'gym-workout' || targetId.toLowerCase().includes('gym'))) {
    quest = quests.find(
      (item) => item.id === 'gym-workout' || item.title?.toLowerCase().includes('gym')
    )
  }

  if (!quest) return { error: 'Quest data could not be located.' }
  if (quest.status === 'completed') return { quest, player: getPlayer(), alreadyCompleted: true }
  if (!options.bypassVerification && String(quest.verification).toLowerCase() !== 'none') {
    return { quest, requiresVerification: true }
  }

  const now = new Date()
  const reward = parseStatReward(quest.statReward)
  const currentPlayer = getPlayer()
  const xpResult = applyXpReward(currentPlayer, quest.xp)
  const stats = { ...currentPlayer.stats }
  Object.entries(reward).forEach(([stat, amount]) => {
    stats[stat] = (Number(stats[stat]) || 0) + amount
  })
  let player = { ...xpResult.player, stats }
  const completedQuest = {
    ...quest,
    status: 'completed',
    completedAt: now.toISOString(),
    progress: quest.target || quest.progress || 1,
    verificationProof: options.proof || quest.verificationProof || null,
    history: [
      {
        date: 'Today',
        time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        status: 'COMPLETED',
        xp: quest.xp,
      },
      ...(quest.history || []),
    ],
  }

  // Strictly match only the specific quest being completed
  const matchedKey = String(quest.id || quest._id || quest.questKey || '').trim()
  const updatedQuests = quests.map((item) => {
    const isExactMatch =
      Boolean(quest.id && item.id && item.id === quest.id) ||
      Boolean(quest._id && item._id && item._id === quest._id) ||
      Boolean(quest.questKey && item.questKey && item.questKey === quest.questKey) ||
      Boolean(matchedKey && (item.id === matchedKey || item._id === matchedKey || item.questKey === matchedKey))

    return isExactMatch ? completedQuest : item
  })

  persistQuests(updatedQuests)
  recordDailyCompletion(updatedQuests, now)

  const allDailyQuestsCompleted = updatedQuests.every((item) => item.status === 'completed')
  if (allDailyQuestsCompleted) {
    player = applyStreakUpdate(player, now)
  }

  localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(player))
  const bossDamageResult = applyQuestDamageToBoss(completedQuest, `${quest.id || 'quest'}-${completedQuest.completedAt}`)
  const achievementResult = evaluateAchievements()

  // Trigger Notifications
  addNotification({
    type: 'quest_completed',
    eventKey: `quest-completed-${quest.id || 'q'}-${completedQuest.completedAt}`,
    title: 'MISSION COMPLETED',
    message: `${completedQuest.title} finished. +${quest.xp} XP & ${formatStatReward(quest.statReward)} applied.`,
    tone: 'emerald',
    iconName: 'CheckCircle2',
    link: `/quests/${quest.id || ''}`,
  })

  if (xpResult.leveledUp) {
    addNotification({
      type: 'level_up',
      eventKey: `level-up-${xpResult.newLevel}-${now.toISOString().slice(0, 10)}`,
      title: `LEVEL UP: LEVEL ${xpResult.newLevel}`,
      message: `Your power has increased from Level ${xpResult.previousLevel} to Level ${xpResult.newLevel}!`,
      tone: 'cyan',
      iconName: 'Zap',
      link: '/profile',
    })
  }

  if (bossDamageResult?.justDefeated) {
    addNotification({
      type: 'boss_defeated',
      eventKey: `boss-defeated-${bossDamageResult.boss.id}`,
      title: 'WEEKLY BOSS VANQUISHED',
      message: `${bossDamageResult.boss.name} shattered! +1,000 XP claimed.`,
      tone: 'rose',
      iconName: 'Skull',
      link: '/boss',
    })
  }

  achievementResult?.newlyUnlocked?.forEach((ach) => {
    addNotification({
      type: 'achievement_unlocked',
      eventKey: `achieve-unlocked-${ach.id}`,
      title: 'ACHIEVEMENT UNLOCKED',
      message: `${ach.name}: ${ach.description} (+${ach.points} AP).`,
      tone: 'amber',
      iconName: 'Trophy',
      link: '/achievements',
    })
  })

  window.dispatchEvent(new Event('rankora-player-updated'))
  window.dispatchEvent(new Event('rankora-workout-updated'))

  return {
    quest: completedQuest,
    player,
    reward,
    gainedXp: quest.xp,
    bossDamage: bossDamageResult,
    newlyUnlockedAchievements: achievementResult.newlyUnlocked,
    ...xpResult,
  }
}

export function useQuestCompletion(questId) {
  const targetId = String(questId || '').trim()
  const [state, setState] = useState(() => ({
    quest: getStoredQuests().find(
      (item) =>
        (item.id && item.id === targetId) ||
        (item._id && item._id === targetId) ||
        (item.questKey && item.questKey === targetId)
    ),
    player: getPlayer(),
  }))

  const complete = (options = {}) => {
    const result = completeQuest(questId, options)
    if (!result.error && !result.requiresVerification && !result.alreadyCompleted) {
      setState({ quest: result.quest, player: result.player })
    }
    return result
  }

  return {
    ...state,
    complete,
    refresh: () =>
      setState({
        quest: getStoredQuests().find(
          (item) =>
            (item.id && item.id === targetId) ||
            (item._id && item._id === targetId) ||
            (item.questKey && item.questKey === targetId)
        ),
        player: getPlayer(),
      }),
  }
}

