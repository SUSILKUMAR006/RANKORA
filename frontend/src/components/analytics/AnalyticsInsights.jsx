import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  Flame,
  Sparkles,
  Terminal,
  TrendingUp,
  Zap,
} from 'lucide-react'
import Card from '../common/Card.jsx'
import SystemMessage from '../common/SystemMessage.jsx'

function AnalyticsInsights({ insights }) {
  const insightCards = [
    {
      id: 'top-cat',
      label: 'MOST COMPLETED DISCIPLINE',
      value: insights.mostCompletedCategory,
      detail: `${insights.mostCompletedShare}% of all successful quests`,
      icon: Award,
      tone: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20',
    },
    {
      id: 'best-day',
      label: 'BEST PERFORMING DAY',
      value: insights.bestPerformingDay,
      detail: 'Highest completion rate and XP volume',
      icon: Calendar,
      tone: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
    },
    {
      id: 'failed-cat',
      label: 'GREATEST RESISTANCE',
      value: insights.mostFailedCategory,
      detail: 'Category with most recorded misses',
      icon: AlertTriangle,
      tone: 'text-rose-300 bg-rose-400/10 border-rose-400/20',
    },
    {
      id: 'failure-reason',
      label: 'PRIMARY OBSTACLE',
      value: insights.mostCommonFailureReason,
      detail: 'Most frequent failure reason recorded',
      icon: TrendingUp,
      tone: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
    },
    {
      id: 'streak-status',
      label: 'MOMENTUM STATUS',
      value: insights.streakStatus,
      detail: 'Daily discipline rhythm',
      icon: Flame,
      tone: 'text-orange-300 bg-orange-400/10 border-orange-400/20',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Primary System Analysis Message */}
      <SystemMessage
        eyebrow="RANKORA TELEMETRY & SYSTEM ANALYSIS"
        title="WEEKLY PERFORMANCE DIAGNOSTIC"
        message={insights.systemAnalysis}
      />

      {/* Grid of 5 Computed Insights */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {insightCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="h-full"
            >
              <Card
                variant="glass"
                className="flex h-full flex-col justify-between border-white/10 p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="label-caps text-[0.6rem] text-slate-500">{card.label}</p>
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${card.tone}`}
                  >
                    <Icon size={14} />
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="font-display text-base font-semibold text-white">
                    {card.value}
                  </h3>
                  <p className="mt-0.5 text-[0.68rem] leading-relaxed text-slate-400">
                    {card.detail}
                  </p>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default AnalyticsInsights
