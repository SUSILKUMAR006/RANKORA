import {
  Award,
  CalendarCheck,
  Crown,
  Dumbbell,
  Flame,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from 'lucide-react'
import { fallbackPlayer, getStoredPlayer } from '../data/mockDashboardData.js'
import { getStoredQuests } from '../hooks/useQuestCompletion.js'
import { requiredXpForLevel } from './xpUtils.js'

export const ACHIEVEMENTS_STORAGE_KEY = 'rankora_achievements'

export const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'first-awakening',
    name: 'First Awakening',
    description: 'Awaken your potential and complete the system initialization.',
    category: 'System',
    icon: Sparkles,
    target: 1,
    unit: 'Complete',
    points: 50,
    rarity: 'Common',
    color: 'cyan',
  },
  {
    id: '7-day-streak',
    name: '7 Day Streak',
    description: 'Maintain unbroken momentum for 7 consecutive days.',
    category: 'Streak',
    icon: Flame,
    target: 7,
    unit: 'Days',
    points: 100,
    rarity: 'Rare',
    color: 'amber',
  },
  {
    id: '30-day-streak',
    name: '30 Day Streak',
    description: 'Forge unbreakable discipline across 30 consecutive active days.',
    category: 'Streak',
    icon: Flame,
    target: 30,
    unit: 'Days',
    points: 250,
    rarity: 'Epic',
    color: 'rose',
  },
  {
    id: '10-quests',
    name: '10 Completed Quests',
    description: 'Successfully execute and complete 10 daily routine missions.',
    category: 'Quests',
    icon: Swords,
    target: 10,
    unit: 'Quests',
    points: 100,
    rarity: 'Common',
    color: 'cyan',
  },
  {
    id: '50-quests',
    name: '50 Completed Quests',
    description: 'Execute 50 daily routine missions across your journey.',
    category: 'Quests',
    icon: Swords,
    target: 50,
    unit: 'Quests',
    points: 200,
    rarity: 'Rare',
    color: 'violet',
  },
  {
    id: '100-quests',
    name: '100 Completed Quests',
    description: 'Successfully execute and complete 100 missions in real life.',
    category: 'Quests',
    icon: Trophy,
    target: 100,
    unit: 'Quests',
    points: 300,
    rarity: 'Epic',
    color: 'amber',
  },
  {
    id: '1000-xp',
    name: '1,000 XP',
    description: 'Accumulate a lifetime total of 1,000 experience points.',
    category: 'Progression',
    icon: Zap,
    target: 1000,
    unit: 'XP',
    points: 75,
    rarity: 'Common',
    color: 'cyan',
  },
  {
    id: '10000-xp',
    name: '10,000 XP',
    description: 'Ascend to elite status by accumulating 10,000 total experience points.',
    category: 'Progression',
    icon: Crown,
    target: 10000,
    unit: 'XP',
    points: 300,
    rarity: 'Legendary',
    color: 'amber',
  },
  {
    id: 'gym-mastery',
    name: '30 Gym Workouts',
    description: 'Complete 30 strength sessions backed by verified photo evidence.',
    category: 'Fitness',
    icon: Dumbbell,
    target: 30,
    unit: 'Workouts',
    points: 150,
    rarity: 'Rare',
    color: 'rose',
  },
  {
    id: 'boss-slayer',
    name: 'Boss Slayer',
    description: 'Vanquish a weekly boss and conquer procrastination.',
    category: 'Combat',
    icon: Award,
    target: 1,
    unit: 'Defeated',
    points: 200,
    rarity: 'Epic',
    color: 'rose',
  },
  {
    id: 'perfect-week',
    name: 'Perfect Routine Week',
    description: 'Complete all daily routine missions for 7 consecutive days.',
    category: 'Streak',
    icon: CalendarCheck,
    target: 7,
    unit: 'Days',
    points: 175,
    rarity: 'Rare',
    color: 'emerald',
  },
]

export function calculateLifetimeXp(player) {
  const level = Math.max(1, Number(player?.level) || 1)
  const currentXp = Math.max(0, Number(player?.xp) || 0)
  
  if (player?.totalXp && typeof player.totalXp === 'number') {
    return Math.max(player.totalXp, currentXp)
  }

  let totalFromLevels = 0
  for (let i = 1; i < level; i++) {
    totalFromLevels += requiredXpForLevel(i)
  }

  return totalFromLevels + currentXp
}

export function getCalculatedProgress(achievementId) {
  const player = getStoredPlayer() || fallbackPlayer
  const quests = getStoredQuests()
  const lifetimeXp = calculateLifetimeXp(player)

  // Aggregate real stats strictly from player executions
  let completedCount = 0
  let gymWorkoutsCount = 0

  quests.forEach((q) => {
    const historyDone = (q.history || []).filter((h) => h.status === 'COMPLETED').length
    const isCurrentlyDone = q.status === 'completed' ? 1 : 0
    const totalDoneForQuest = Math.max(historyDone, isCurrentlyDone)
    completedCount += totalDoneForQuest

    if (q.title?.toLowerCase().includes('gym') || q.id === 'gym-workout') {
      gymWorkoutsCount += totalDoneForQuest
    }
  })

  // Real streaks
  const currentStreak = Math.max(0, Number(player.currentStreak) || 0)
  const bestStreak = Math.max(currentStreak, Number(player.bestStreak) || 0)

  // Check real boss victory
  let bossDefeated = false
  try {
    const weeklyBoss = JSON.parse(localStorage.getItem('rankora_weekly_boss'))
    if (
      weeklyBoss?.currentBoss?.status === 'DEFEATED' ||
      (weeklyBoss?.currentBoss?.currentHp !== undefined && weeklyBoss.currentBoss.currentHp <= 0) ||
      (Array.isArray(weeklyBoss?.history) && weeklyBoss.history.length > 0)
    ) {
      bossDefeated = true
    }
  } catch {
    bossDefeated = false
  }

  switch (achievementId) {
    case 'first-awakening': {
      const isAwakened = Boolean(player && (player.name || player.username || player.level >= 1))
      return {
        current: isAwakened ? 1 : 0,
        target: 1,
        isUnlocked: isAwakened,
      }
    }
    case '7-day-streak': {
      return {
        current: bestStreak,
        target: 7,
        isUnlocked: bestStreak >= 7,
      }
    }
    case '30-day-streak': {
      return {
        current: bestStreak,
        target: 30,
        isUnlocked: bestStreak >= 30,
      }
    }
    case '10-quests': {
      return {
        current: completedCount,
        target: 10,
        isUnlocked: completedCount >= 10,
      }
    }
    case '50-quests': {
      return {
        current: completedCount,
        target: 50,
        isUnlocked: completedCount >= 50,
      }
    }
    case '100-quests': {
      return {
        current: completedCount,
        target: 100,
        isUnlocked: completedCount >= 100,
      }
    }
    case '1000-xp': {
      return {
        current: lifetimeXp,
        target: 1000,
        isUnlocked: lifetimeXp >= 1000,
      }
    }
    case '10000-xp': {
      return {
        current: lifetimeXp,
        target: 10000,
        isUnlocked: lifetimeXp >= 10000,
      }
    }
    case 'gym-mastery': {
      return {
        current: gymWorkoutsCount,
        target: 30,
        isUnlocked: gymWorkoutsCount >= 30,
      }
    }
    case 'boss-slayer': {
      return {
        current: bossDefeated ? 1 : 0,
        target: 1,
        isUnlocked: bossDefeated,
      }
    }
    case 'perfect-week': {
      const isPerfect = bestStreak >= 7
      return {
        current: Math.min(7, bestStreak),
        target: 7,
        isUnlocked: isPerfect,
      }
    }
    default:
      return { current: 0, target: 1, isUnlocked: false }
  }
}

export function evaluateAchievements() {
  const now = new Date().toISOString()

  const allEvaluated = ACHIEVEMENT_DEFINITIONS.map((def) => {
    const progress = getCalculatedProgress(def.id)
    const isUnlocked = Boolean(progress.isUnlocked)
    const currentClamped = Math.min(def.target, Math.max(0, progress.current))
    const percentage = isUnlocked ? 100 : Math.min(100, Math.round((currentClamped / def.target) * 100))

    return {
      ...def,
      current: currentClamped,
      target: def.target,
      percentage,
      isUnlocked,
      unlockedAt: isUnlocked ? now : null,
      remaining: Math.max(0, def.target - currentClamped),
    }
  })

  const unlockedCount = allEvaluated.filter((a) => a.isUnlocked).length
  const totalCount = allEvaluated.length
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100)
  const totalPoints = allEvaluated.filter((a) => a.isUnlocked).reduce((sum, a) => sum + (a.points || 0), 0)
  const maxPoints = allEvaluated.reduce((sum, a) => sum + (a.points || 0), 0)

  return {
    achievements: allEvaluated,
    newlyUnlocked: [],
    unlockedCount,
    totalCount,
    completionPercentage,
    totalPoints,
    maxPoints,
  }
}

export function formatUnlockDate(isoDateString) {
  if (!isoDateString) return null
  try {
    const date = new Date(isoDateString)
    if (Number.isNaN(date.getTime())) return 'Recently'

    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Unlocked today'
    if (diffDays === 1) return 'Unlocked yesterday'
    if (diffDays < 7) return `Unlocked ${diffDays} days ago`

    return `Unlocked ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)}`
  } catch {
    return 'Unlocked'
  }
}

export function getLatestUnlockedAchievement() {
  const { achievements } = evaluateAchievements()
  const unlocked = achievements
    .filter((a) => a.isUnlocked && a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))

  if (unlocked.length > 0) {
    const latest = unlocked[0]
    return {
      title: latest.name.toUpperCase(),
      detail: formatUnlockDate(latest.unlockedAt),
      icon: latest.icon,
      rarity: latest.rarity,
      id: latest.id,
    }
  }

  return {
    title: 'FIRST AWAKENING',
    detail: 'Unlocked on registration',
    icon: Sparkles,
    rarity: 'Common',
    id: 'first-awakening',
  }
}
