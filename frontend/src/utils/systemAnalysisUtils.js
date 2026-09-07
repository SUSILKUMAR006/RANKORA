import { fallbackPlayer, getStoredPlayer } from '../data/mockDashboardData.js'
import { getStoredQuests } from '../hooks/useQuestCompletion.js'
import { getStoredFailures } from './failureUtils.js'

export function generateSystemAnalysis() {
  const player = getStoredPlayer() || fallbackPlayer
  const quests = getStoredQuests() || []
  const failures = getStoredFailures() || []

  let totalCompletions = 0
  const categoryCompletedMap = {}
  const categoryFailedMap = {}
  const dayCompletionMap = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  }
  const dayFailureMap = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  }
  const questFailureMap = {}
  const failureReasonMap = {}

  // Process Quests & Histories (Strictly real data)
  quests.forEach((quest) => {
    const cat = quest.category || 'Fitness'
    if (quest.status === 'completed') {
      totalCompletions += 1
      categoryCompletedMap[cat] = (categoryCompletedMap[cat] || 0) + 1
      const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })
      if (dayCompletionMap[todayDay] !== undefined) {
        dayCompletionMap[todayDay] += 1
      }
    }

    if (Array.isArray(quest.history)) {
      quest.history.forEach((h) => {
        if (h.status === 'COMPLETED') {
          totalCompletions += 1
          categoryCompletedMap[cat] = (categoryCompletedMap[cat] || 0) + 1
          if (h.date || h.timestamp) {
            try {
              const d = new Date(h.date || h.timestamp)
              const dName = d.toLocaleDateString('en-US', { weekday: 'long' })
              if (dayCompletionMap[dName] !== undefined) {
                dayCompletionMap[dName] += 1
              }
            } catch {
              // ignore
            }
          }
        } else if (h.status === 'FAILED') {
          categoryFailedMap[cat] = (categoryFailedMap[cat] || 0) + 1
          if (h.reason) {
            failureReasonMap[h.reason] = (failureReasonMap[h.reason] || 0) + 1
          }
        }
      })
    }
  })

  // Process Failures
  failures.forEach((f) => {
    const reason = f.reason || 'Distraction'
    failureReasonMap[reason] = (failureReasonMap[reason] || 0) + 1
    const questName = f.questTitle || 'Daily Quest'
    questFailureMap[questName] = (questFailureMap[questName] || 0) + 1

    if (f.failedAt || f.date) {
      try {
        const d = new Date(f.failedAt || f.date)
        const dayName = d.toLocaleDateString('en-US', { weekday: 'long' })
        if (dayFailureMap[dayName] !== undefined) {
          dayFailureMap[dayName] += 1
        }
      } catch {
        // ignore
      }
    }
  })

  // If 0 completions and 0 failures
  if (totalCompletions === 0 && failures.length === 0) {
    const emptyMetrics = {
      strongestCategory: 'None',
      weakestCategory: 'None',
      mostCompletedCategory: 'None',
      mostCommonFailureReason: 'None',
      bestPerformingDay: 'None',
      weakestDay: 'None',
      completionRate: '0%',
      currentStreakStatus: `${player.currentStreak || 0} Days`,
      frequentlyFailedQuest: 'None',
    }
    return {
      hasSufficientData: false,
      emptyMessage: 'INSUFFICIENT DATA — COMPLETE YOUR DAILY ROUTINE MISSIONS TO GENERATE SYSTEM TELEMETRY.',
      confidenceScore: 0,
      primaryInsight: 'INSUFFICIENT DATA — COMPLETE YOUR DAILY ROUTINE MISSIONS TO GENERATE SYSTEM TELEMETRY.',
      metrics: emptyMetrics,
      ...emptyMetrics,
      recommendations: [
        {
          tag: 'INITIALIZATION',
          title: 'INITIALIZE DAILY ROUTINE',
          insight: 'No mission telemetry recorded yet.',
          recommendation: 'Execute your 6 core daily routine quests to establish your baseline discipline momentum.',
          description: 'Execute your 6 core daily routine quests to establish your baseline discipline momentum.',
          impact: 'HIGH IMPACT',
          tone: 'cyan',
        },
      ],
    }
  }

  // Calculate Most Completed Category
  let mostCompletedCategory = 'None'
  let maxCompletedCatCount = 0
  Object.entries(categoryCompletedMap).forEach(([cat, count]) => {
    if (count > maxCompletedCatCount) {
      maxCompletedCatCount = count
      mostCompletedCategory = cat
    }
  })

  // Calculate Most Failed Category
  let mostFailedCategory = 'None'
  let maxFailedCatCount = 0
  Object.entries(categoryFailedMap).forEach(([cat, count]) => {
    if (count > maxFailedCatCount) {
      maxFailedCatCount = count
      mostFailedCategory = cat
    }
  })

  // Most Common Failure Reason
  let mostCommonReason = 'None'
  let maxReasonCount = 0
  Object.entries(failureReasonMap).forEach(([reason, count]) => {
    if (count > maxReasonCount) {
      maxReasonCount = count
      mostCommonReason = reason
    }
  })

  // Frequently Failed Quest
  let frequentlyFailedQuest = 'None'
  let maxQuestFailCount = 0
  Object.entries(questFailureMap).forEach(([name, count]) => {
    if (count > maxQuestFailCount) {
      maxQuestFailCount = count
      frequentlyFailedQuest = name
    }
  })

  // Best Performing Day
  let bestDay = 'None'
  let maxDayCompleted = 0
  Object.entries(dayCompletionMap).forEach(([day, count]) => {
    if (count > maxDayCompleted) {
      maxDayCompleted = count
      bestDay = day
    }
  })

  // Weakest Day
  let weakestDay = 'None'
  let maxDayFailed = 0
  Object.entries(dayFailureMap).forEach(([day, count]) => {
    if (count > maxDayFailed) {
      maxDayFailed = count
      weakestDay = day
    }
  })

  const totalAssigned = totalCompletions + failures.length
  const completionRate =
    totalAssigned > 0 ? `${Math.round((totalCompletions / totalAssigned) * 100)}%` : '0%'

  // Recommendations Generation
  const recommendations = []
  if (mostCommonReason !== 'None') {
    recommendations.push({
      tag: 'FRICTION REDUCTION',
      title: `OVERCOME "${mostCommonReason.toUpperCase()}"`,
      insight: `Repeated friction logged under "${mostCommonReason}".`,
      recommendation: `Schedule and execute high-priority quests earlier in the day to eliminate friction.`,
      description: `Schedule and execute high-priority quests earlier in the day to eliminate friction.`,
      impact: 'HIGH IMPACT',
      tone: 'amber',
    })
  }

  if (bestDay !== 'None') {
    recommendations.push({
      tag: 'PEAK PERFORMANCE',
      title: `CAPITALIZE ON ${bestDay.toUpperCase()}`,
      insight: `Peak execution volume recorded on ${bestDay}.`,
      recommendation: `Schedule high-difficulty boss battles and intensive milestones on ${bestDay} to leverage momentum.`,
      description: `Schedule high-difficulty boss battles and intensive milestones on ${bestDay} to leverage momentum.`,
      impact: 'HIGH IMPACT',
      tone: 'cyan',
    })
  } else {
    recommendations.push({
      tag: 'MOMENTUM PROTOCOL',
      title: 'CONSISTENCY PROTOCOL',
      insight: 'Baseline momentum established.',
      recommendation: 'Maintain your morning wake-up and workout anchors daily to solidify momentum.',
      description: 'Maintain your morning wake-up and workout anchors daily to solidify momentum.',
      impact: 'MEDIUM IMPACT',
      tone: 'cyan',
    })
  }

  const confidenceScore = Math.min(98, Math.max(65, Math.round(50 + totalAssigned * 4)))

  let primaryInsight = `Telemetry indicates peak consistency on ${bestDay !== 'None' ? bestDay : 'weekdays'} with high execution volume in ${mostCompletedCategory !== 'None' ? mostCompletedCategory : 'core routine'}.`
  if (mostCommonReason !== 'None') {
    primaryInsight += ` Primary friction recorded: ${mostCommonReason}.`
  }

  const metricsObj = {
    strongestCategory: mostCompletedCategory,
    weakestCategory: mostFailedCategory,
    mostCompletedCategory,
    mostCommonFailureReason: mostCommonReason,
    bestPerformingDay: bestDay,
    weakestDay: weakestDay,
    completionRate,
    currentStreakStatus: `${player.currentStreak || 0} Days Active`,
    frequentlyFailedQuest,
  }

  return {
    hasSufficientData: true,
    confidenceScore,
    primaryInsight,
    metrics: metricsObj,
    ...metricsObj,
    recommendations,
  }
}
