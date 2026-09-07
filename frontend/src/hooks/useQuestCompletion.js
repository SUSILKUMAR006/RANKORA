import { useState } from 'react'
import { fallbackPlayer, getStoredPlayer } from '../data/mockDashboardData.js'
import { defaultRoutineQuests, getQuestIcon, mockQuests } from '../data/mockQuests.js'
import { applyXpReward, parseStatReward } from '../utils/xpUtils.js'
import { isToday } from '../utils/failureUtils.js'
import { evaluateAchievements } from '../utils/achievementUtils.js'
import { applyQuestDamageToBoss } from '../utils/bossUtils.js'
import { addNotification } from '../utils/notificationUtils.js'
import { formatStatReward } from '../utils/xpUtils.js'

export const QUEST_STORAGE_KEY = 'rankora_mock_quests'
export const PLAYER_STORAGE_KEY = 'rankora_player'

export function getStoredQuests() {
  try {
    const saved = JSON.parse(localStorage.getItem(QUEST_STORAGE_KEY))
    if (Array.isArray(saved) && saved.length > 0) {
      return saved.map((quest) => ({
        ...quest,
        icon: getQuestIcon(quest),
      }))
    }
    return defaultRoutineQuests.map((quest) => ({
      ...quest,
      icon: getQuestIcon(quest),
    }))
  } catch {
    return defaultRoutineQuests.map((quest) => ({
      ...quest,
      icon: getQuestIcon(quest),
    }))
  }
}

function persistQuests(quests) {
  localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(quests.map((quest) => {
    const storedQuest = { ...quest }
    delete storedQuest.icon
    return storedQuest
  })))
}

function getPlayer() {
  const stored = getStoredPlayer()
  return { ...fallbackPlayer, ...stored, stats: { ...fallbackPlayer.stats, ...(stored.stats || {}) } }
}

export function completeQuest(questId, options = {}) {
  const quests = getStoredQuests()
  let quest = quests.find(
    (item) => item.id === questId || item._id === questId || item.questKey === questId
  )
  if (!quest && (questId === 'gym-workout' || String(questId).toLowerCase().includes('gym'))) {
    quest = quests.find((item) => item.id === 'gym-workout' || item.title?.toLowerCase().includes('gym'))
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
  Object.entries(reward).forEach(([stat, amount]) => { stats[stat] = (Number(stats[stat]) || 0) + amount })
  const player = { ...xpResult.player, stats }
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
  const updatedQuests = quests.map((item) =>
    (item.id === quest.id || item._id === quest._id || (item.questKey && item.questKey === quest.questKey))
      ? completedQuest
      : item
  )
  persistQuests(updatedQuests)
  localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(player))
  const bossDamageResult = applyQuestDamageToBoss(completedQuest, `${quest.id}-${completedQuest.completedAt}`)
  const achievementResult = evaluateAchievements()

  // Trigger Notifications
  addNotification({
    type: 'quest_completed',
    eventKey: `quest-completed-${quest.id}-${completedQuest.completedAt}`,
    title: 'MISSION COMPLETED',
    message: `${completedQuest.title} finished. +${quest.xp} XP & ${formatStatReward(quest.statReward)} applied.`,
    tone: 'emerald',
    iconName: 'CheckCircle2',
    link: `/quests/${quest.id}`,
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
  const [state, setState] = useState(() => ({
    quest: getStoredQuests().find((item) => item.id === questId || item._id === questId || item.questKey === questId),
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
        quest: getStoredQuests().find((item) => item.id === questId || item._id === questId || item.questKey === questId),
        player: getPlayer(),
      }),
  }
}
