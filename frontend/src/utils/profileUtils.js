import {
  Award,
  BookOpen,
  Brain,
  Camera,
  CheckCircle2,
  Dumbbell,
  Flame,
  HeartPulse,
  Scale,
  Shield,
  Skull,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from 'lucide-react'
import { fallbackPlayer, getStoredPlayer } from '../data/mockDashboardData.js'
import { getStoredQuests } from '../hooks/useQuestCompletion.js'
import { evaluateAchievements, calculateLifetimeXp } from './achievementUtils.js'
import { getStoredWeeklyBoss } from './bossUtils.js'
import { getStoredFailures } from './failureUtils.js'
import { getStoredProgressPhotos } from './progressUtils.js'
import { requiredXpForLevel } from './xpUtils.js'

export const STAT_METADATA = [
  {
    key: 'str',
    code: 'STR',
    name: 'Strength',
    description: 'Physical power, muscular resilience, and resistance training mastery.',
    icon: Dumbbell,
    tone: 'rose',
    color: '#fb7185',
    maxThreshold: 25,
  },
  {
    key: 'vit',
    code: 'VIT',
    name: 'Vitality',
    description: 'Biological endurance, cellular hydration, and restorative sleep recovery.',
    icon: HeartPulse,
    tone: 'emerald',
    color: '#34d399',
    maxThreshold: 25,
  },
  {
    key: 'int',
    code: 'INT',
    name: 'Intelligence',
    description: 'Deep software engineering, long-form reading, and cognitive speed.',
    icon: Brain,
    tone: 'violet',
    color: '#a78bfa',
    maxThreshold: 25,
  },
  {
    key: 'agi',
    code: 'AGI',
    name: 'Agility',
    description: 'Execution promptness, swift reaction to resistance, and dynamic momentum.',
    icon: Zap,
    tone: 'cyan',
    color: '#67e8f9',
    maxThreshold: 25,
  },
  {
    key: 'disc',
    code: 'DISC',
    name: 'Discipline',
    description: 'Unbroken streak maintenance, impulse control, and focus shielding.',
    icon: Scale,
    tone: 'amber',
    color: '#fbbf24',
    maxThreshold: 25,
  },
]

export function getFullProfileData() {
  const player = getStoredPlayer() || fallbackPlayer
  const quests = getStoredQuests()
  const failures = getStoredFailures()
  const photos = getStoredProgressPhotos()
  const weeklyBossData = getStoredWeeklyBoss()
  const achievementData = evaluateAchievements()

  // XP & Level calculations
  const level = Math.max(1, Number(player.level) || 1)
  const currentXp = Math.max(0, Number(player.xp) || 0)
  const requiredXp = requiredXpForLevel(level)
  const remainingXp = Math.max(0, requiredXp - currentXp)
  const xpPercentage = Math.min(100, Math.round((currentXp / requiredXp) * 100))
  const lifetimeXp = calculateLifetimeXp(player)

  // Quest stats aggregation (Strictly real)
  let completedQuestCount = 0
  quests.forEach((q) => {
    if (q.status === 'completed') completedQuestCount += 1
    const historyCount = (q.history || []).filter((h) => h.status === 'COMPLETED').length
    completedQuestCount += historyCount
  })

  const baseCompleted = Number(player.completedQuestsCount) || completedQuestCount
  const failedCount = failures.length
  const totalQuests = baseCompleted + failedCount
  const successRate = totalQuests > 0 ? Math.round((baseCompleted / totalQuests) * 100) : 0

  // Player RPG Stats (Starting from 0)
  const playerStats = player.stats || { str: 0, vit: 0, int: 0, agi: 0, disc: 0 }
  const formattedStats = STAT_METADATA.map((stat) => {
    const rawVal = Number(playerStats[stat.key]) || 0
    const progress = Math.min(100, Math.round((rawVal / stat.maxThreshold) * 100))
    return {
      ...stat,
      value: rawVal,
      progress,
    }
  })

  // Progress Summary tallies
  const bossHistory = weeklyBossData.history || []
  const currentBossDefeated = weeklyBossData.currentBoss?.status === 'DEFEATED' ? 1 : 0
  const bossesDefeatedCount = bossHistory.length + currentBossDefeated

  let diaryCount = 0
  try {
    const diaryRaw = localStorage.getItem('rankora_diary')
    if (diaryRaw) {
      const parsed = JSON.parse(diaryRaw)
      diaryCount = Array.isArray(parsed) ? parsed.length : 0
    }
  } catch {
    diaryCount = 0
  }

  const progressSummary = {
    totalXp: lifetimeXp,
    achievementsUnlocked: achievementData.unlockedCount,
    totalAchievements: achievementData.totalCount,
    bossesDefeated: bossesDefeatedCount,
    checkpointsCount: photos.length + (player.startingPhoto ? 1 : 0),
    diaryEntriesCount: diaryCount,
  }

  // Unified Recent Activity Stream (Real only)
  const activityList = []

  // 1. Quests completed
  quests.forEach((q) => {
    if (q.status === 'completed') {
      activityList.push({
        id: `act-quest-${q.id}`,
        type: 'quest',
        title: q.title,
        subtitle: `Mission completed · +${q.xp} XP`,
        category: q.category || 'Fitness',
        icon: Swords,
        tone: 'emerald',
        link: `/quests/${q.id}`,
        timestamp: q.completedAt || new Date().toISOString(),
      })
    }
  })

  // 2. Achievements unlocked
  achievementData.achievements.forEach((ach) => {
    if (ach.isUnlocked) {
      activityList.push({
        id: `act-ach-${ach.id}`,
        type: 'achievement',
        title: ach.name,
        subtitle: `Achievement unlocked · +${ach.points} Pts`,
        category: 'Trophy',
        icon: Trophy,
        tone: 'amber',
        link: '/achievements',
        timestamp: ach.unlockedAt || new Date().toISOString(),
      })
    }
  })

  // 3. Failures logged
  failures.forEach((f) => {
    activityList.push({
      id: `act-fail-${f.id}`,
      type: 'failure',
      title: f.questTitle || 'Mission Failed',
      subtitle: `Recorded resistance: "${f.reason || 'Distraction'}"`,
      category: 'Failure',
      icon: Skull,
      tone: 'rose',
      link: '/analytics',
      timestamp: f.date || f.timestamp || new Date().toISOString(),
    })
  })

  // Sort real activity stream descending by timestamp
  activityList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  return {
    player: {
      ...player,
      level,
      xp: currentXp,
      requiredXp,
      remainingXp,
      xpPercentage,
      rank: player.rank || 'E',
      currentStreak: Number(player.currentStreak) || 0,
      bestStreak: Number(player.bestStreak) || 0,
      primaryPath: player.primaryPath || 'Discipline',
    },
    metrics: {
      totalQuests,
      completedQuests: baseCompleted,
      failedQuests: failedCount,
      successRate,
    },
    stats: formattedStats,
    progressSummary,
    recentActivity: activityList.slice(0, 10),
  }
}
