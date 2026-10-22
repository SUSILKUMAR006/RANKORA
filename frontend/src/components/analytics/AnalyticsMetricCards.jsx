import { motion } from 'framer-motion'
import {
  Crown,
  CheckCircle2,
  Flame,
  Gauge,
  Percent,
  Swords,
  XCircle,
  Zap,
} from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'

function AnalyticsMetricCards({ metrics = {} }) {
  const safe = metrics || {}
  const totalQuests = safe.totalQuests ?? 0
  const completedQuests = safe.completedQuests ?? 0
  const failedQuests = safe.failedQuests ?? 0
  const successRate = safe.successRate ?? 0
  const totalXp = safe.totalXp ?? 0
  const currentStreak = safe.currentStreak ?? 0
  const bestStreak = safe.bestStreak ?? 0

  const cards = [
    {
      id: 'total-quests',
      label: 'Total Quests',
      value: totalQuests.toLocaleString(),
      subtext: 'Assigned in period',
      icon: Swords,
      iconColor: 'text-system-300',
      valueColor: 'text-frost-50',
    },
    {
      id: 'completed-quests',
      label: 'Completed',
      value: completedQuests.toLocaleString(),
      subtext: 'Executed successfully',
      icon: CheckCircle2,
      iconColor: 'text-clear-300',
      valueColor: 'text-clear-300',
    },
    {
      id: 'failed-quests',
      label: 'Failed',
      value: failedQuests.toLocaleString(),
      subtext: 'Resistance encounters',
      icon: XCircle,
      iconColor: 'text-penalty-300',
      valueColor: 'text-penalty-300',
    },
    {
      id: 'success-rate',
      label: 'Success Rate',
      value: `${successRate}%`,
      subtext: 'Completion ratio',
      icon: Percent,
      iconColor: 'text-system-300',
      valueColor: 'text-system-200',
    },
    {
      id: 'total-xp',
      label: 'Total XP',
      value: `+${totalXp.toLocaleString()}`,
      subtext: 'Lifetime experience',
      icon: Zap,
      iconColor: 'text-gold-300',
      valueColor: 'text-gold-300',
    },
    {
      id: 'current-streak',
      label: 'Current Streak',
      value: `${currentStreak}`,
      unit: 'Days',
      subtext: 'Active discipline',
      icon: Flame,
      iconColor: 'text-ember-400',
      valueColor: 'text-ember-300',
    },
    {
      id: 'best-streak',
      label: 'Best Streak',
      value: `${bestStreak}`,
      unit: 'Days',
      subtext: 'Personal record',
      icon: Crown,
      iconColor: 'text-gold-300',
      valueColor: 'text-gold-200',
    },
  ]

  return (
    <SystemWindow title="Combat Record" icon={<Gauge size={13} />}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-7">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`sys-inset flex min-w-0 flex-col justify-between px-3 py-3 sm:px-4 ${
                index === cards.length - 1 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="label-caps text-[0.68rem] text-frost-500">{card.label}</p>
                <Icon size={14} className={`shrink-0 ${card.iconColor}`} />
              </div>
              <div className="mt-3">
                <p className={`truncate font-display text-3xl font-bold leading-none sys-glow xl:text-2xl 2xl:text-3xl ${card.valueColor}`}>
                  {card.value}
                  {card.unit && (
                    <span className="ml-1 text-sm font-semibold text-frost-500 text-shadow-none">{card.unit}</span>
                  )}
                </p>
                <p className="mt-1.5 font-mono text-[0.68rem] text-frost-500">{card.subtext}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </SystemWindow>
  )
}

export default AnalyticsMetricCards
