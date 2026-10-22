import { useEffect, useState } from 'react'
import {
  Award,
  Brain,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import Badge from '../common/Badge.jsx'
import SystemWindow from '../common/SystemWindow.jsx'
import InsightMetricCard from './InsightMetricCard.jsx'
import RecommendationBanner from './RecommendationBanner.jsx'
import { generateSystemAnalysis } from '../../utils/systemAnalysisUtils.js'

function SystemAnalysisPanel({ className = '', analysis: initialAnalysis }) {
  const [analysis, setAnalysis] = useState(() => initialAnalysis || generateSystemAnalysis())

  useEffect(() => {
    if (initialAnalysis) {
      setAnalysis(initialAnalysis)
    }
  }, [initialAnalysis])

  useEffect(() => {
    const handleUpdate = () => {
      setAnalysis(generateSystemAnalysis())
    }

    window.addEventListener('storage', handleUpdate)
    window.addEventListener('rankora-player-updated', handleUpdate)
    window.addEventListener('rankora-notifications-updated', handleUpdate)
    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('rankora-player-updated', handleUpdate)
      window.removeEventListener('rankora-notifications-updated', handleUpdate)
    }
  }, [])

  // Handle Insufficient Data
  if (!analysis || !analysis.hasSufficientData) {
    return (
      <SystemWindow title="Analysis" icon={<Brain size={14} />} className={className} bodyClassName="px-6 py-10 text-center sm:px-8">
        <span className="relative mx-auto grid h-12 w-12 place-items-center">
          <span className="absolute inset-1.5 rotate-45 border border-edge-strong bg-void-950" />
          <Brain size={20} className="relative text-frost-500" />
        </span>
        <h3 className="mt-4 font-display text-base font-bold uppercase tracking-[0.16em] text-frost-200">
          Telemetry offline
        </h3>
        <p className="mx-auto mt-2 max-w-md font-mono text-xs leading-5 text-frost-500">
          {analysis?.emptyMessage ||
            'INSUFFICIENT DATA — COMPLETE MORE QUESTS TO UNLOCK SYSTEM ANALYSIS.'}
        </p>
        <p className="label-caps mt-4 flex items-center justify-center gap-2 text-frost-600">
          <span className="h-1.5 w-1.5 rotate-45 animate-sys-pulse bg-system-400/70" />
          Awaiting data
        </p>
      </SystemWindow>
    )
  }

  const rawMetrics = analysis.metrics || analysis
  const metrics = {
    bestPerformingDay: rawMetrics.bestPerformingDay || 'None',
    weakestDay: rawMetrics.weakestDay || 'None',
    mostCommonFailureReason: rawMetrics.mostCommonFailureReason || 'None',
    mostCompletedCategory:
      rawMetrics.mostCompletedCategory || rawMetrics.strongestCategory || 'None',
    completionRate: rawMetrics.completionRate || '0%',
    currentStreakStatus: rawMetrics.currentStreakStatus || '0 Days',
  }
  const recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : []
  const primaryRec = recommendations[0]
  const confidenceScore = analysis.confidenceScore ?? 85
  const primaryInsight =
    analysis.primaryInsight ||
    `Telemetry active. Strongest execution observed on ${metrics.bestPerformingDay}.`

  return (
    <SystemWindow
      title="Analysis"
      icon={<Brain size={14} />}
      className={className}
      bodyClassName="space-y-5"
      actions={
        <Badge tone="status" className="gap-1.5 font-mono">
          <span className="h-1.5 w-1.5 animate-sys-pulse rounded-full bg-system-300" />
          {confidenceScore}% confidence
        </Badge>
      }
    >
      {/* Primary System Analysis Diagnostic Readout */}
      <div className="sys-inset px-4 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="label-caps text-system-300">Pattern &amp; reliability analysis</p>
          <p className="label-caps text-[0.62rem] text-frost-600">Rankora system telemetry</p>
        </div>
        <p className="mt-2 flex gap-2 text-sm leading-6 text-frost-100">
          <span className="shrink-0 font-mono text-system-400">&gt;</span>
          <span>{primaryInsight}</span>
        </p>
      </div>

      {/* 4-Metric Diagnostic Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <InsightMetricCard
          icon={TrendingUp}
          label="BEST PERFORMING DAY"
          value={metrics.bestPerformingDay}
          subtext="Highest execution volume & completion rate"
          tone="emerald"
        />
        <InsightMetricCard
          icon={TrendingDown}
          label="WEAKEST CONSISTENCY"
          value={metrics.weakestDay}
          subtext="Telemetry indicates greatest drop-off"
          tone="rose"
        />
        <InsightMetricCard
          icon={ShieldAlert}
          label="PRIMARY RESISTANCE"
          value={metrics.mostCommonFailureReason}
          subtext="Most logged friction in mission records"
          tone="amber"
        />
        <InsightMetricCard
          icon={Award}
          label="DOMINANT DISCIPLINE"
          value={metrics.mostCompletedCategory}
          subtext="Highest level of discipline momentum"
          tone="cyan"
        />
      </div>

      {/* Primary Tactical Recommendation Callout */}
      {primaryRec && (
        <RecommendationBanner
          tag={primaryRec.tag || 'SYSTEM RECOMMENDATION'}
          title={primaryRec.title || 'TACTICAL ADJUSTMENT'}
          insight={primaryRec.insight || primaryRec.description}
          recommendation={primaryRec.recommendation || primaryRec.description}
          impact={primaryRec.impact || 'HIGH IMPACT'}
          tone={primaryRec.tone || 'cyan'}
        />
      )}
    </SystemWindow>
  )
}

export default SystemAnalysisPanel
