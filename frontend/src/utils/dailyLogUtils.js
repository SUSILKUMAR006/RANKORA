export const DAILY_LOG_STORAGE_KEY = 'rankora_daily_log'

function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

export function getDailyLog() {
  try {
    const raw = localStorage.getItem(DAILY_LOG_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveDailyLog(log) {
  try {
    localStorage.setItem(DAILY_LOG_STORAGE_KEY, JSON.stringify(log))
  } catch {
    // ignore
  }
}

export function recordDailyCompletion(quests, now = new Date()) {
  const total = quests.length
  const completed = quests.filter((q) => q.status === 'completed').length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  const log = getDailyLog()
  log[toDateKey(now)] = { total, completed, percentage }
  saveDailyLog(log)
  return log
}

export function getWeeklyOverview(now = new Date()) {
  const log = getDailyLog()
  const dayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  const todayKey = toDateKey(now)

  // ISO week: Monday start
  const jsDay = now.getDay() // 0 = Sun, 1 = Mon, ...
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay
  const monday = new Date(now)
  monday.setDate(monday.getDate() + mondayOffset)

  return dayLabels.map((label, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    const key = toDateKey(date)
    const entry = log[key]

    if (key > todayKey) return { day: label, value: 'empty' }
    if (!entry || entry.completed === 0) return { day: label, value: 'empty' }
    if (entry.percentage >= 100) return { day: label, value: 'done' }
    return { day: label, value: `${entry.percentage}%` }
  })
}
