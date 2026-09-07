import { Activity, BookOpen, Camera, Coins, Droplets, Dumbbell, Plus } from 'lucide-react'

export const fallbackPlayer = {
  playerName: 'PLAYER',
  avatar: 'solar',
  level: 1,
  xp: 0,
  rank: 'E',
  currentStreak: 0,
  bestStreak: 0,
  lastStreakDate: null,
  stats: { str: 0, vit: 0, int: 0, agi: 0, disc: 0 },
}

export const dashboardData = {
  quests: [],
  weekly: [
    { day: 'MON', value: 'empty' },
    { day: 'TUE', value: 'empty' },
    { day: 'WED', value: 'empty' },
    { day: 'THU', value: 'empty' },
    { day: 'FRI', value: 'empty' },
    { day: 'SAT', value: 'empty' },
    { day: 'SUN', value: 'empty' },
  ],
  boss: {
    name: 'THE PROCRASTINATOR',
    hp: 500,
    maxHp: 500,
    remaining: 500,
    attacks: [],
  },
  analysis: {
    strongest: 'Discipline',
    weakest: 'None',
    recommendation: 'Initialize daily quests to begin collecting telemetry signals.',
  },
  achievement: {
    title: 'FIRST AWAKENING',
    detail: 'Unlocked on registration',
  },
}

export const quickActions = [
  { label: 'Add Quest', detail: 'Set a new objective', icon: Plus, path: '/quests/create' },
  { label: 'Track Expenses', detail: 'Manage treasury telemetry', icon: Coins, path: '/expenses' },
  { label: 'Write Diary', detail: "Capture today's reflection", icon: BookOpen, path: '/diary' },
  { label: 'Add Progress', detail: 'Record a milestone', icon: Camera, path: '/progress' },
  { label: 'View Analytics', detail: 'Inspect your patterns', icon: Activity, path: '/analytics' },
]

export function getStoredPlayer() {
  try {
    const raw = localStorage.getItem('rankora_player')
    if (raw) {
      return { ...fallbackPlayer, ...JSON.parse(raw) }
    }
    return fallbackPlayer
  } catch {
    return fallbackPlayer
  }
}
