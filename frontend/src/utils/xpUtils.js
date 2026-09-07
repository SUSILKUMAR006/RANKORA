export function requiredXpForLevel(level) {
  return 100 + ((Math.max(1, level) - 1) * 50)
}

export function getXpProgress(level = 1, xp = 0) {
  const required = requiredXpForLevel(level)
  const current = Math.max(0, xp)
  return { current, required, remaining: Math.max(0, required - current), percentage: Math.min(100, Math.round((current / required) * 100)) }
}

export function applyXpReward(player, gainedXp) {
  let level = Math.max(1, Number(player.level) || 1)
  let xp = Math.max(0, Number(player.xp) || 0) + Math.max(0, gainedXp)
  const previousLevel = level
  while (xp >= requiredXpForLevel(level)) {
    xp -= requiredXpForLevel(level)
    level += 1
  }
  return { player: { ...player, level, xp }, previousLevel, newLevel: level, leveledUp: level > previousLevel }
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

export function applyStreakUpdate(player, now = new Date()) {
  const todayKey = toDateKey(now)
  const lastDate = player.lastStreakDate || null

  if (lastDate === todayKey) {
    // Streak for today was already counted.
    return { ...player }
  }

  let currentStreak = Number(player.currentStreak) || 0

  if (lastDate) {
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayKey = toDateKey(yesterday)

    currentStreak = lastDate === yesterdayKey ? currentStreak + 1 : 1
  } else {
    currentStreak = 1
  }

  const bestStreak = Math.max(Number(player.bestStreak) || 0, currentStreak)

  return { ...player, currentStreak, bestStreak, lastStreakDate: todayKey }
}

export function getEffectiveStreak(player, now = new Date()) {
  const currentStreak = Number(player?.currentStreak) || 0
  const lastDate = player?.lastStreakDate || null
  if (!lastDate || currentStreak === 0) return 0

  const todayKey = toDateKey(now)
  if (lastDate === todayKey) return currentStreak

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = toDateKey(yesterday)

  return lastDate === yesterdayKey ? currentStreak : 0
}

export function parseStatReward(statReward) {
  if (!statReward || statReward === 'NONE') return {}
  if (typeof statReward === 'object') return statReward
  const match = String(statReward).match(/\+?(\d+)\s*([A-Z]+)/i)
  return match ? { [match[2].toLowerCase()]: Number(match[1]) } : {}
}

export function formatStatReward(statReward) {
  const rewards = parseStatReward(statReward)
  const entries = Object.entries(rewards)
  return entries.length ? entries.map(([stat, value]) => `+${value} ${stat.toUpperCase()}`).join(' · ') : 'NONE'
}
