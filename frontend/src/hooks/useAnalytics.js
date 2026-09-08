import { useCallback, useEffect, useState } from 'react'
import { PERIODS, getAnalyticsData } from '../utils/analyticsUtils.js'
import { syncQuestsFromServer } from '../services/questSync.js'

export function useAnalytics(initialPeriod = '7d') {
  const [period, setPeriod] = useState(initialPeriod)
  const [data, setData] = useState(() => getAnalyticsData(initialPeriod))

  const refresh = useCallback(
    (targetPeriod = period) => {
      const updated = getAnalyticsData(targetPeriod)
      setData(updated)
      return updated
    },
    [period]
  )

  useEffect(() => {
    refresh(period)
  }, [period, refresh])

  useEffect(() => {
    syncQuestsFromServer().then(() => refresh(period))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleStorage = (e) => {
      if (
        e.key === 'rankora_player' ||
        e.key === 'rankora_mock_quests' ||
        e.key === 'rankora_failures' ||
        e.key === 'rankora_weekly_boss'
      ) {
        refresh(period)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [period, refresh])

  return {
    period,
    setPeriod,
    periods: PERIODS,
    periodLabel: data.periodLabel,
    metrics: data.metrics,
    charts: data.charts,
    insights: data.insights,
    refresh,
  }
}
