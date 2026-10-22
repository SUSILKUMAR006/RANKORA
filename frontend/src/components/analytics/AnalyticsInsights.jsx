import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Award,
  Calendar,
  Flame,
  Terminal,
  TrendingUp,
} from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'
import SystemMessage from '../common/SystemMessage.jsx'

// Marker styles for each log line: a diamond for readings, an [!] box for alerts.
const markerTones = {
  system: { text: 'text-system-300', diamond: 'border-system-400 bg-system-500/40 shadow-[0_0_6px_rgba(74,174,255,0.7)]' },
  clear: { text: 'text-clear-300', diamond: 'border-clear-400 bg-clear-500/40 shadow-[0_0_6px_rgba(52,217,156,0.6)]' },
  penalty: { text: 'text-penalty-300', box: 'border-penalty-400 bg-penalty-500/10 text-penalty-200' },
  gold: { text: 'text-gold-300', box: 'border-gold-400 bg-gold-500/10 text-gold-200' },
  ember: { text: 'text-ember-300', diamond: 'border-ember-400 bg-ember-500/40 shadow-[0_0_6px_rgba(255,138,61,0.6)]' },
}

function AnalyticsInsights({ insights = {} }) {
  const safe = insights || {}
  const insightCards = [
    {
      id: 'top-cat',
      label: 'MOST COMPLETED DISCIPLINE',
      value: safe.mostCompletedCategory || 'None',
      detail: `${safe.mostCompletedShare || 0}% of all successful quests`,
      icon: Award,
      tone: 'system',
    },
    {
      id: 'best-day',
      label: 'BEST PERFORMING DAY',
      value: safe.bestPerformingDay || 'None',
      detail: 'Highest completion rate and XP volume',
      icon: Calendar,
      tone: 'clear',
    },
    {
      id: 'failed-cat',
      label: 'GREATEST RESISTANCE',
      value: safe.mostFailedCategory || 'None',
      detail: 'Category with most recorded misses',
      icon: AlertTriangle,
      tone: 'penalty',
    },
    {
      id: 'failure-reason',
      label: 'PRIMARY OBSTACLE',
      value: safe.mostCommonFailureReason || 'None',
      detail: 'Most frequent failure reason recorded',
      icon: TrendingUp,
      tone: 'gold',
    },
    {
      id: 'streak-status',
      label: 'MOMENTUM STATUS',
      value: safe.streakStatus || '0 Days Active',
      detail: 'Daily discipline rhythm',
      icon: Flame,
      tone: 'ember',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Primary System Analysis Message */}
      <SystemMessage
        eyebrow="RANKORA TELEMETRY & SYSTEM ANALYSIS"
        title="WEEKLY PERFORMANCE DIAGNOSTIC"
        message={
          safe.systemAnalysis ||
          'Complete routine quests to generate performance telemetry.'
        }
      />

      {/* System log of 5 computed insights */}
      <SystemWindow title="System Log" icon={<Terminal size={13} />} bodyClassName="p-0">
        <ul className="divide-y divide-edge/60">
          {insightCards.map((card, index) => {
            const Icon = card.icon
            const style = markerTones[card.tone] || markerTones.system
            return (
              <motion.li
                key={card.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-system-500/5 sm:gap-4 sm:px-5"
              >
                {style.box ? (
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border font-display text-xs font-bold ${style.box}`}
                  >
                    !
                  </span>
                ) : (
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center">
                    <span className={`h-2 w-2 rotate-45 border ${style.diamond}`} />
                  </span>
                )}

                <div className="min-w-0 flex-1 sm:grid sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-baseline sm:gap-4">
                  <p className={`label-caps flex items-center gap-1.5 ${style.text}`}>
                    <Icon size={12} className="shrink-0" />
                    {card.label}
                  </p>
                  <div className="mt-1 min-w-0 sm:mt-0">
                    <h3 className="break-words font-display text-base font-bold uppercase tracking-[0.08em] text-frost-50">
                      {card.value}
                    </h3>
                    <p className="mt-0.5 text-xs leading-5 text-frost-500">{card.detail}</p>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </SystemWindow>
    </div>
  )
}

export default AnalyticsInsights
