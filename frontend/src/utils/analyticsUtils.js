import { fallbackPlayer, getStoredPlayer } from '../data/mockDashboardData.js'
import { getStoredQuests } from '../hooks/useQuestCompletion.js'
import { getStoredFailures } from './failureUtils.js'
import { calculateLifetimeXp } from './achievementUtils.js'
import { getDailyLog } from './dailyLogUtils.js'

export const PERIODS = [
  { id: '7d', label: '7 Days', days: 7 },
  { id: '30d', label: '30 Days', days: 30 },
  { id: '90d', label: '90 Days', days: 90 },
  { id: 'all', label: 'All Time', days: 365 },
]

export const CATEGORY_COLORS = {
  Mind: '#fbbf24', // Amber
  Health: '#34d399', // Emerald
  Fitness: '#fb7185', // Rose
  Career: '#67e8f9', // Cyan
  Knowledge: '#a78bfa', // Violet
  General: '#94a3b8', // Slate
}

export function getAnalyticsData(periodId = '7d') {
  const period = PERIODS.find((p) => p.id === periodId) || PERIODS[0]
  const player = getStoredPlayer() || fallbackPlayer
  const quests = getStoredQuests()
  const failures = getStoredFailures()
  const lifetimeXp = Number(player.xp) || 0

  const now = new Date()
  const periodDays = period.days

  // Generate date points for the period
  const dateMap = new Map()
  for (let i = periodDays - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' })
    const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    dateMap.set(key, {
      date: key,
      dayLabel,
      shortDate,
      completed: 0,
      failed: 0,
      xp: 0,
      quests: [],
    })
  }

  let totalCompletedCount = 0
  let totalFailedCount = 0

  const categoryStats = {
    Mind: { count: 0, xp: 0, failed: 0 },
    Health: { count: 0, xp: 0, failed: 0 },
    Fitness: { count: 0, xp: 0, failed: 0 },
    Career: { count: 0, xp: 0, failed: 0 },
    Knowledge: { count: 0, xp: 0, failed: 0 },
  }

  const dayOfWeekCounts = {
    Mon: { completed: 0, failed: 0, xp: 0 },
    Tue: { completed: 0, failed: 0, xp: 0 },
    Wed: { completed: 0, failed: 0, xp: 0 },
    Thu: { completed: 0, failed: 0, xp: 0 },
    Fri: { completed: 0, failed: 0, xp: 0 },
    Sat: { completed: 0, failed: 0, xp: 0 },
    Sun: { completed: 0, failed: 0, xp: 0 },
  }

  // Process Live Quests and their real history
  const todayKey = now.toISOString().slice(0, 10)
  const todayDayName = now.toLocaleDateString('en-US', { weekday: 'short' })

  // Backfill past days from the persisted daily-completion log (server-synced),
  // since a completed quest's own history is cleared on the next day's reset.
  const dailyLog = getDailyLog()
  dateMap.forEach((entry, key) => {
    if (key === todayKey) return
    const logEntry = dailyLog[key]
    if (!logEntry) return
    entry.completed = logEntry.completed || 0
    entry.failed = logEntry.failed || 0
    entry.xp = logEntry.xpEarned || 0
    totalCompletedCount += entry.completed
    totalFailedCount += entry.failed
    const dayName = new Date(`${key}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' })
    if (dayOfWeekCounts[dayName]) {
      dayOfWeekCounts[dayName].completed += entry.completed
      dayOfWeekCounts[dayName].failed += entry.failed
      dayOfWeekCounts[dayName].xp += entry.xp
    }
  })

  quests.forEach((q) => {
    const cat = q.category && categoryStats[q.category] ? q.category : 'General'

    // If completed today
    if (q.status === 'completed') {
      totalCompletedCount += 1
      if (categoryStats[cat]) {
        categoryStats[cat].count += 1
        categoryStats[cat].xp += Number(q.xp) || 0
      }
      if (dateMap.has(todayKey)) {
        const entry = dateMap.get(todayKey)
        entry.completed += 1
        entry.xp += Number(q.xp) || 0
      }
      if (dayOfWeekCounts[todayDayName]) {
        dayOfWeekCounts[todayDayName].completed += 1
        dayOfWeekCounts[todayDayName].xp += Number(q.xp) || 0
      }
    }

    // If failed today
    if (q.status === 'failed') {
      totalFailedCount += 1
      if (categoryStats[cat]) {
        categoryStats[cat].failed += 1
      }
      if (dateMap.has(todayKey)) {
        const entry = dateMap.get(todayKey)
        entry.failed += 1
      }
      if (dayOfWeekCounts[todayDayName]) {
        dayOfWeekCounts[todayDayName].failed += 1
      }
    }

    // Process logged history entries if any
    if (Array.isArray(q.history)) {
      q.history.forEach((h) => {
        const dateKey = (h.date || h.timestamp || '').slice(0, 10)
        const isCompleted = h.status === 'COMPLETED' || h.status === 'completed'
        const isFailed = h.status === 'FAILED' || h.status === 'failed'

        if (dateMap.has(dateKey)) {
          const entry = dateMap.get(dateKey)
          if (isCompleted) {
            entry.completed += 1
            entry.xp += Number(h.xp || q.xp) || 0
            totalCompletedCount += 1
            if (categoryStats[cat]) {
              categoryStats[cat].count += 1
              categoryStats[cat].xp += Number(h.xp || q.xp) || 0
            }
          }
          if (isFailed) {
            entry.failed += 1
            totalFailedCount += 1
            if (categoryStats[cat]) {
              categoryStats[cat].failed += 1
            }
          }
        }
      })
    }
  })

  // Process Real Failures from failure storage
  failures.forEach((f) => {
    const fDate = (f.date || f.timestamp || '').slice(0, 10)
    if (dateMap.has(fDate)) {
      dateMap.get(fDate).failed += 1
    }
  })

  const totalQuests = totalCompletedCount + totalFailedCount
  const successRate = totalQuests > 0 ? Math.round((totalCompletedCount / totalQuests) * 100) : 0
  const currentStreak = Number(player.currentStreak) || 0
  const bestStreak = Number(player.bestStreak) || 0

  // 1. Weekly Quest Completion Chart Data
  const weeklyCompletionData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
    const stats = dayOfWeekCounts[day] || { completed: 0, failed: 0, xp: 0 }
    const total = stats.completed + stats.failed
    return {
      day,
      completed: stats.completed,
      failed: stats.failed,
      rate: total > 0 ? Math.round((stats.completed / total) * 100) : 0,
      xp: stats.xp,
    }
  })

  // 2. XP Progress History Chart Data (Real cumulative growth)
  let cumulativeXp = 0
  const xpHistoryData = Array.from(dateMap.values())
    .filter((_, idx, arr) => {
      if (arr.length <= 14) return true
      if (arr.length <= 30) return idx % 2 === 0 || idx === arr.length - 1
      if (arr.length <= 90) return idx % 5 === 0 || idx === arr.length - 1
      return idx % 15 === 0 || idx === arr.length - 1
    })
    .map((item) => {
      cumulativeXp += item.xp
      return {
        date: item.shortDate,
        xp: cumulativeXp,
        gained: item.xp,
      }
    })

  // 3. Quest Categories Chart Data
  const totalCatCount = Object.values(categoryStats).reduce((sum, c) => sum + c.count, 0)
  const categoryChartData = Object.entries(categoryStats).map(([name, data]) => ({
    name,
    count: data.count,
    xp: data.xp,
    percentage: totalCatCount > 0 ? Math.round((data.count / totalCatCount) * 100) : 0,
    color: CATEGORY_COLORS[name] || CATEGORY_COLORS.General,
  }))

  // 4. Completed vs Failed Chart Data
  const chunkSize = periodDays <= 7 ? 1 : periodDays <= 30 ? 5 : periodDays <= 90 ? 14 : 30
  const allEntries = Array.from(dateMap.values())
  const completedVsFailedData = []

  for (let i = 0; i < allEntries.length; i += chunkSize) {
    const chunk = allEntries.slice(i, i + chunkSize)
    const label =
      chunkSize === 1
        ? chunk[0].dayLabel
        : `${chunk[0].shortDate} - ${chunk[chunk.length - 1].shortDate}`
    const chunkCompleted = chunk.reduce((sum, item) => sum + item.completed, 0)
    const chunkFailed = chunk.reduce((sum, item) => sum + item.failed, 0)
    completedVsFailedData.push({
      label,
      completed: chunkCompleted,
      failed: chunkFailed,
      total: chunkCompleted + chunkFailed,
      rate:
        chunkCompleted + chunkFailed > 0
          ? Math.round((chunkCompleted / (chunkCompleted + chunkFailed)) * 100)
          : 0,
    })
  }

  // 5. Daily Activity Heatmap Grid
  const heatmapDaysCount = periodDays <= 30 ? 28 : 70
  const heatmapData = []
  for (let i = heatmapDaysCount - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' })
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const entry = dateMap.get(key)
    const completed = entry ? entry.completed : 0
    const xp = entry ? entry.xp : 0
    const level =
      completed === 0 ? 0 : completed === 1 ? 1 : completed <= 2 ? 2 : completed <= 4 ? 3 : 4

    heatmapData.push({
      date: key,
      formattedDate,
      dayOfWeek,
      completed,
      xp,
      level,
    })
  }

  // Real Insights Calculations
  const activeCompletedCategories = categoryChartData.filter((c) => c.count > 0)
  const mostCompletedCat = activeCompletedCategories.sort((a, b) => b.count - a.count)[0]
  const mostFailedCat = Object.entries(categoryStats)
    .filter(([, data]) => data.failed > 0)
    .sort(([, a], [, b]) => b.failed - a.failed)[0]

  const activeDays = weeklyCompletionData.filter((d) => d.completed > 0)
  const bestDay = activeDays.sort((a, b) => b.completed - a.completed)[0]

  const failureReasons = failures.map((f) => f.reason).filter(Boolean)
  const reasonCounts = failureReasons.reduce(
    (acc, r) => ({ ...acc, [r]: (acc[r] || 0) + 1 }),
    {}
  )
  const mostCommonReason =
    Object.entries(reasonCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None'

  const systemNarrative =
    totalCompletedCount > 0
      ? `You completed ${totalCompletedCount} quests in this timeframe. ${mostCompletedCat ? mostCompletedCat.name : 'Routine'} is your primary momentum area.`
      : `No telemetry logs recorded in this period. Execute your daily routine quests to generate performance telemetry.`

  return {
    period: period.id,
    periodLabel: period.label,
    metrics: {
      totalQuests,
      completedQuests: totalCompletedCount,
      failedQuests: totalFailedCount,
      successRate,
      totalXp: lifetimeXp,
      currentStreak,
      bestStreak,
    },
    charts: {
      weeklyCompletion: weeklyCompletionData,
      xpHistory: xpHistoryData,
      categories: categoryChartData,
      completedVsFailed: completedVsFailedData,
      heatmap: heatmapData,
    },
    insights: {
      mostCompletedCategory: mostCompletedCat ? mostCompletedCat.name : 'None',
      mostCompletedShare: mostCompletedCat ? mostCompletedCat.percentage : 0,
      mostFailedCategory: mostFailedCat ? mostFailedCat[0] : 'None',
      mostCommonFailureReason: mostCommonReason,
      bestPerformingDay: bestDay ? bestDay.day : 'None',
      streakStatus:
        currentStreak > 0
          ? `${currentStreak} Days Active · On Track`
          : '0 Days · Ready to start',
      systemAnalysis: systemNarrative,
    },
  }
}
