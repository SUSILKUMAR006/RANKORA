export const FAILURE_STORAGE_KEY = 'rankora_failures'

export function getStoredFailures() {
  try {
    const stored = JSON.parse(localStorage.getItem(FAILURE_STORAGE_KEY))
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export function getQuestFailures(questId) {
  return getStoredFailures().filter((failure) => failure.questId === questId).sort((a, b) => new Date(b.failedAt) - new Date(a.failedAt))
}

export function getFailureStats(failures = getStoredFailures()) {
  const reasonCounts = failures.reduce((counts, failure) => ({ ...counts, [failure.reason]: (counts[failure.reason] || 0) + 1 }), {})
  const mostCommonReason = Object.entries(reasonCounts).sort(([, first], [, second]) => second - first)[0]?.[0] || null
  return { totalFailures: failures.length, reasonCounts, mostCommonReason }
}

export function isToday(value) {
  if (!value) return false
  const date = new Date(value)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}
