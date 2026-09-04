import {
  Activity,
  BookOpen,
  Code2,
  Droplets,
  Dumbbell,
  Flame,
  Moon,
  Shield,
  Skull,
  Sparkles,
  Swords,
  Zap,
} from 'lucide-react'
import { fallbackPlayer, getStoredPlayer } from '../data/mockDashboardData.js'
import { applyXpReward } from './xpUtils.js'
import { evaluateAchievements } from './achievementUtils.js'

export const BOSS_STORAGE_KEY = 'rankora_weekly_boss'

export const BOSS_ARCHETYPES = [
  {
    id: 'procrastinator',
    name: 'THE PROCRASTINATOR',
    title: 'Lord of Inertia & Delay',
    description: 'A shadowy monolith that feeds on hesitation, unfinished objectives, and rationalizations. Strikes must be landed through daily disciplined execution.',
    icon: Skull,
    maxHp: 1000,
    avatarTheme: 'rose',
    weakness: 'Gym & Coding Sessions',
  },
  {
    id: 'distraction-swarm',
    name: 'THE DISTRACTION SWARM',
    title: 'Devourer of Focus & Attention',
    description: 'A chaotic entity composed of fragmented thoughts, endless feeds, and phantom notifications. Deep work and knowledge blocks shatter its armor.',
    icon: Zap,
    maxHp: 1000,
    avatarTheme: 'amber',
    weakness: 'Reading & Deep Study',
  },
  {
    id: 'chronos-sloth',
    name: 'CHRONOS OF SLOTH',
    title: 'Temporal Parasite of Momentum',
    description: 'An ancient chronal beast that slows your reaction speed and drains willpower before sessions begin. Crush it with morning momentum.',
    icon: Flame,
    maxHp: 1000,
    avatarTheme: 'violet',
    weakness: 'Hydration & Consistent Streaks',
  },
  {
    id: 'cognitive-fog',
    name: 'THE COGNITIVE FOG',
    title: 'Bane of Clear Thinking',
    description: 'A dense psionic mist that obscures goals and weakens resolve. Vanquished through disciplined hydration, sleep protection, and study.',
    icon: Moon,
    maxHp: 1000,
    avatarTheme: 'cyan',
    weakness: 'Reading & Sleep Protection',
  },
]

export const ATTACK_CATEGORIES = [
  { id: 'gym', label: 'Gym Workout', category: 'Fitness', damage: 100, icon: Dumbbell, color: 'rose' },
  { id: 'wakeup', label: 'Wake Up 5:30 AM', category: 'Discipline', damage: 50, icon: Flame, color: 'amber' },
  { id: 'reading', label: 'Read Book Daily', category: 'Knowledge', damage: 40, icon: BookOpen, color: 'violet' },
  { id: 'nofap', label: 'No Fap', category: 'Discipline', damage: 50, icon: Flame, color: 'amber' },
  { id: 'nojunk', label: 'No Junk Food', category: 'Discipline', damage: 50, icon: Sparkles, color: 'emerald' },
  { id: 'hydration', label: 'Drink 3L Water', category: 'Health', damage: 30, icon: Droplets, color: 'cyan' },
  { id: 'sleep', label: 'Sleep Before 11PM', category: 'Health', damage: 50, icon: Moon, color: 'indigo' },
]

export function getISOWeekInfo(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  const year = d.getUTCFullYear()

  // Calculate Monday and Sunday of this week
  const curr = new Date(date)
  const first = curr.getDate() - (curr.getDay() === 0 ? 6 : curr.getDay() - 1)
  const monday = new Date(curr.setDate(first))
  const sunday = new Date(curr.setDate(first + 6))

  const formatShort = (d) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d)

  return {
    weekKey: `${year}-W${String(weekNo).padStart(2, '0')}`,
    weekNumber: weekNo,
    year,
    label: `Week ${weekNo} · ${formatShort(monday)} - ${formatShort(sunday)}`,
    startDate: monday.toISOString(),
    endDate: sunday.toISOString(),
  }
}

export function getInitialBossData() {
  const weekInfo = getISOWeekInfo()
  const archetype = BOSS_ARCHETYPES[0]

  return {
    currentBoss: {
      id: `${archetype.id}-${weekInfo.weekKey}`,
      archetypeId: archetype.id,
      weekKey: weekInfo.weekKey,
      weekLabel: weekInfo.label,
      name: archetype.name,
      title: archetype.title,
      description: archetype.description,
      weakness: archetype.weakness,
      maxHp: archetype.maxHp,
      currentHp: archetype.maxHp,
      status: 'ACTIVE', // 'ACTIVE' | 'DEFEATED'
      defeatedAt: null,
      xpReward: 1000,
      rewardClaimed: false,
      processedQuestIds: [],
      damageLog: [],
      attacks: ATTACK_CATEGORIES,
    },
    history: [],
  }
}

export function getStoredWeeklyBoss() {
  try {
    const raw = localStorage.getItem(BOSS_STORAGE_KEY)
    const weekInfo = getISOWeekInfo()
    let data = raw ? JSON.parse(raw) : null

    if (!data || !data.currentBoss) {
      data = getInitialBossData()
      saveWeeklyBoss(data)
      return data
    }

    // Check if week rolled over
    if (data.currentBoss.weekKey !== weekInfo.weekKey) {
      // Archive previous boss into history if defeated or was active
      const prevBoss = data.currentBoss
      const historyEntry = {
        id: `${prevBoss.id}-archived`,
        weekKey: prevBoss.weekKey,
        weekLabel: prevBoss.weekLabel,
        name: prevBoss.name,
        title: prevBoss.title,
        maxHp: prevBoss.maxHp,
        status: prevBoss.status,
        defeatedAt: prevBoss.defeatedAt || new Date().toISOString(),
        totalDamageDealt: prevBoss.maxHp - prevBoss.currentHp,
        xpAwarded: prevBoss.status === 'DEFEATED' ? prevBoss.xpReward : 0,
        topAttack: 'Multi-Quest Assault',
      }

      // Select next archetype
      const nextIndex = (weekInfo.weekNumber || 0) % BOSS_ARCHETYPES.length
      const nextArchetype = BOSS_ARCHETYPES[nextIndex]

      data = {
        currentBoss: {
          id: `${nextArchetype.id}-${weekInfo.weekKey}`,
          archetypeId: nextArchetype.id,
          weekKey: weekInfo.weekKey,
          weekLabel: weekInfo.label,
          name: nextArchetype.name,
          title: nextArchetype.title,
          description: nextArchetype.description,
          weakness: nextArchetype.weakness,
          maxHp: nextArchetype.maxHp,
          currentHp: nextArchetype.maxHp,
          status: 'ACTIVE',
          defeatedAt: null,
          xpReward: 1000,
          rewardClaimed: false,
          processedQuestIds: [],
          damageLog: [],
          attacks: ATTACK_CATEGORIES,
        },
        history: [historyEntry, ...(data.history || [])],
      }

      saveWeeklyBoss(data)
    }

    return data
  } catch {
    const defaultData = getInitialBossData()
    saveWeeklyBoss(defaultData)
    return defaultData
  }
}

export function saveWeeklyBoss(data) {
  try {
    localStorage.setItem(BOSS_STORAGE_KEY, JSON.stringify(data))
    // Also mirror basic boss object for backward compatibility
    if (data?.currentBoss) {
      localStorage.setItem(
        'rankora_boss',
        JSON.stringify({
          name: data.currentBoss.name,
          hp: data.currentBoss.currentHp,
          maxHp: data.currentBoss.maxHp,
          defeated: data.currentBoss.status === 'DEFEATED',
        })
      )
    }
  } catch {
    // ignore in demo
  }
}

export function getQuestDamage(quest) {
  if (!quest) return 30
  const category = (quest.category || '').toLowerCase()
  const title = (quest.title || '').toLowerCase()
  const id = (quest.id || '').toLowerCase()

  if (category === 'fitness' || id.includes('gym') || title.includes('gym') || title.includes('workout')) {
    return 100
  }
  if (category === 'career' || id.includes('coding') || title.includes('coding') || title.includes('code')) {
    return 100
  }
  if (category === 'knowledge' || id.includes('read') || title.includes('read') || title.includes('study')) {
    return 50
  }
  if (category === 'health' || id.includes('water') || title.includes('water') || id.includes('drink')) {
    return 30
  }
  if (category === 'mind' || id.includes('meditation') || title.includes('meditation')) {
    return 40
  }

  // Fallback by difficulty
  if (quest.difficulty === 'Hard') return 80
  if (quest.difficulty === 'Normal') return 50
  return 30
}

export function applyQuestDamageToBoss(quest, completionId = null) {
  const data = getStoredWeeklyBoss()
  const boss = data.currentBoss

  if (!boss) return { boss: null, damageDealt: 0, duplicate: false, justDefeated: false }

  const uniqueKey =
    completionId ||
    `${quest.id}-${quest.completedAt || new Date().toISOString().slice(0, 10)}`

  // Prevent duplicate strikes from the same quest completion
  if (boss.processedQuestIds && boss.processedQuestIds.includes(uniqueKey)) {
    return {
      boss,
      damageDealt: 0,
      duplicate: true,
      justDefeated: false,
    }
  }

  const damage = getQuestDamage(quest)
  const previousHp = boss.currentHp
  const newHp = Math.max(0, previousHp - damage)
  const wasActive = boss.status === 'ACTIVE'
  const justDefeated = wasActive && newHp === 0

  boss.currentHp = newHp
  boss.processedQuestIds = [...(boss.processedQuestIds || []), uniqueKey]

  // Add to battle damage log
  const newLogEntry = {
    id: `dmg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    questId: quest.id,
    questTitle: quest.title,
    damage,
    category: quest.category || 'General',
    timestamp: new Date().toISOString(),
  }
  boss.damageLog = [newLogEntry, ...(boss.damageLog || [])].slice(0, 50)

  let playerXpResult = null

  if (justDefeated) {
    boss.status = 'DEFEATED'
    boss.defeatedAt = new Date().toISOString()
    boss.rewardClaimed = true

    // Award +1000 XP to player profile
    try {
      const currentPlayer = getStoredPlayer() || fallbackPlayer
      playerXpResult = applyXpReward(currentPlayer, boss.xpReward || 1000)
      localStorage.setItem('rankora_player', JSON.stringify(playerXpResult.player))
    } catch {
      // ignore
    }

    // Add victory record to history
    const historyEntry = {
      id: `${boss.id}-victory-${Date.now()}`,
      weekKey: boss.weekKey,
      weekLabel: boss.weekLabel,
      name: boss.name,
      title: boss.title,
      maxHp: boss.maxHp,
      status: 'DEFEATED',
      defeatedAt: boss.defeatedAt,
      totalDamageDealt: boss.maxHp,
      xpAwarded: boss.xpReward,
      topAttack: `${quest.title} (Finish Strike)`,
    }

    data.history = [historyEntry, ...(data.history || [])]

    // Re-evaluate achievements so Boss Slayer unlocks
    evaluateAchievements()
  }

  saveWeeklyBoss(data)

  return {
    boss,
    damageDealt: damage,
    previousHp,
    newHp,
    justDefeated,
    duplicate: false,
    player: playerXpResult?.player || null,
    awardedXp: justDefeated ? 1000 : 0,
  }
}

export function claimBossDefeatReward() {
  const data = getStoredWeeklyBoss()
  const boss = data.currentBoss
  if (boss && boss.status === 'DEFEATED' && !boss.rewardClaimed) {
    boss.rewardClaimed = true
    const currentPlayer = getStoredPlayer() || fallbackPlayer
    const playerXpResult = applyXpReward(currentPlayer, boss.xpReward || 1000)
    localStorage.setItem('rankora_player', JSON.stringify(playerXpResult.player))
    saveWeeklyBoss(data)
    return { success: true, player: playerXpResult.player, xp: boss.xpReward || 1000 }
  }
  return { success: true }
}

