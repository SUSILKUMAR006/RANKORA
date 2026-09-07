import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  AlertTriangle,
  Award,
  Brain,
  Calendar,
  CheckCircle2,
  Flame,
  Lightbulb,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Card from '../common/Card.jsx'
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
      <Card variant="glass" className={`p-6 sm:p-8 text-center ${className}`}>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-500">
          <Brain size={24} />
        </div>
        <h3 className="mt-4 font-display text-sm font-semibold tracking-wider text-slate-300 uppercase">
          TELEMETRY OFFLINE
        </h3>
        <p className="mt-2 font-mono text-xs text-slate-500 max-w-md mx-auto">
          {analysis?.emptyMessage ||
            'INSUFFICIENT DATA — COMPLETE MORE QUESTS TO UNLOCK SYSTEM ANALYSIS.'}
        </p>
      </Card>
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
    <Card variant="glass" className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-violet-300/30 bg-violet-400/10 text-violet-200">
            <Brain size={20} />
          </span>
          <div>
            <p className="label-caps text-violet-300/80">RANKORA SYSTEM TELEMETRY</p>
            <h2 className="font-display text-base font-semibold text-white">
              PATTERN & RELIABILITY ANALYSIS
            </h2>
          </div>
        </div>

        <Badge tone="category" className="gap-1.5 font-mono text-[0.62rem]">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />
          {confidenceScore}% CONFIDENCE
        </Badge>
      </div>

      {/* Primary System Analysis Diagnostic Bar */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 font-mono text-xs leading-relaxed text-slate-300">
        <p className="label-caps text-[0.6rem] text-violet-300">SYSTEM ANALYSIS</p>
        <p className="mt-1 text-slate-200 font-sans text-sm">
          {primaryInsight}
        </p>
      </div>

      {/* 4-Metric Diagnostic Grid */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
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
    </Card>
  )
}

export default SystemAnalysisPanel
