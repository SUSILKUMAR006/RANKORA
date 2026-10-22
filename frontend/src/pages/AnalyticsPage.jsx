import { motion } from 'framer-motion'
import { PageHeader } from '../components/common/SectionHeader.jsx'
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
    <div className="space-y-6 pb-12 sm:space-y-8">
      {/* Header with Period Filters */}
      <PageHeader
        eyebrow="System / Analysis"
        title="Performance Analytics"
        description="Inspect your execution consistency, category distribution, XP growth, and personal discipline momentum over time."
        actions={
          <AnalyticsPeriodFilter
            periods={periods}
            activePeriod={period}
            onSelectPeriod={setPeriod}
          />
        }
      />

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
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-frost-600"
      >
        <span className="h-1.5 w-1.5 rotate-45 animate-sys-pulse bg-system-400 shadow-[0_0_6px_rgba(74,174,255,0.9)]" />
        <span>Rankora Telemetry · Recharts Engine Active · {periodLabel} View</span>
      </motion.p>
    </div>
  )
}

export default AnalyticsPage
