import { motion } from 'framer-motion'
import { Activity, BarChart3, LineChart, Sparkles } from 'lucide-react'
import ActivityHeatmap from '../components/analytics/ActivityHeatmap.jsx'
import AnalyticsInsights from '../components/analytics/AnalyticsInsights.jsx'
import AnalyticsMetricCards from '../components/analytics/AnalyticsMetricCards.jsx'
import AnalyticsPeriodFilter from '../components/analytics/AnalyticsPeriodFilter.jsx'
import CategoryDistributionChart from '../components/analytics/CategoryDistributionChart.jsx'
import CompletedVsFailedChart from '../components/analytics/CompletedVsFailedChart.jsx'
import WeeklyCompletionChart from '../components/analytics/WeeklyCompletionChart.jsx'
import XPHistoryChart from '../components/analytics/XPHistoryChart.jsx'
import { useAnalytics } from '../hooks/useAnalytics.js'

function AnalyticsPage() {
  const {
    period,
    setPeriod,
    periods,
    periodLabel,
    metrics,
    charts,
    insights,
  } = useAnalytics()

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Period Filters */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
              <BarChart3 size={14} />
            </span>
            <p className="label-caps text-cyan-300/80">
              PLAYER CODEX / TELEMETRY & PATTERNS
            </p>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            PERFORMANCE ANALYTICS
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Inspect your execution consistency, category distribution, XP growth,
            and personal discipline momentum over time.
          </p>
        </div>

        {/* Period Filter Tabs */}
        <AnalyticsPeriodFilter
          periods={periods}
          activePeriod={period}
          onSelectPeriod={setPeriod}
        />
      </motion.header>

      {/* 7 Key Metric Cards */}
      <AnalyticsMetricCards metrics={metrics} />

      {/* Primary Charts Grid: Weekly Completion & XP Trajectory */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyCompletionChart data={charts.weeklyCompletion} />
        <XPHistoryChart data={charts.xpHistory} />
      </div>

      {/* Secondary Charts Grid: Category Distribution & Completed vs Failed */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryDistributionChart data={charts.categories} />
        <CompletedVsFailedChart data={charts.completedVsFailed} />
      </div>

      {/* Daily Activity Heatmap */}
      <ActivityHeatmap data={charts.heatmap} />

      {/* Local Insights & System Diagnostic Narrative */}
      <AnalyticsInsights insights={insights} />

      {/* System Status Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-700"
      >
        Rankora Telemetry · Recharts Engine Active · {periodLabel} View
      </motion.p>
    </div>
  )
}

export default AnalyticsPage
