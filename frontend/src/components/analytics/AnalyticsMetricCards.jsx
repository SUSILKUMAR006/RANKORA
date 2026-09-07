import { motion } from 'framer-motion'
import {
  Award,
  CheckCircle2,
  Crown,
  Flame,
  Percent,
  Swords,
  XCircle,
  Zap,
} from 'lucide-react'
import Card from '../common/Card.jsx'

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
      label: 'TOTAL QUESTS',
      value: totalQuests.toLocaleString(),
      subtext: 'Assigned in period',
      icon: Swords,
      tone: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20',
      valueColor: 'text-white',
    },
    {
      id: 'completed-quests',
      label: 'COMPLETED',
      value: completedQuests.toLocaleString(),
      subtext: 'Executed successfully',
      icon: CheckCircle2,
      tone: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
      valueColor: 'text-emerald-300',
    },
    {
      id: 'failed-quests',
      label: 'FAILED',
      value: failedQuests.toLocaleString(),
      subtext: 'Resistance encounters',
      icon: XCircle,
      tone: 'text-rose-300 bg-rose-400/10 border-rose-400/20',
      valueColor: 'text-rose-300',
    },
    {
      id: 'success-rate',
      label: 'SUCCESS RATE',
      value: `${successRate}%`,
      subtext: 'Completion ratio',
      icon: Percent,
      tone: 'text-violet-300 bg-violet-400/10 border-violet-400/20',
      valueColor: 'text-violet-200',
    },
    {
      id: 'total-xp',
      label: 'TOTAL XP',
      value: `+${totalXp.toLocaleString()}`,
      subtext: 'Lifetime experience',
      icon: Zap,
      tone: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
      valueColor: 'text-amber-300',
    },
    {
      id: 'current-streak',
      label: 'CURRENT STREAK',
      value: `${currentStreak} Days`,
      subtext: 'Active discipline',
      icon: Flame,
      tone: 'text-orange-300 bg-orange-400/10 border-orange-400/20',
      valueColor: 'text-orange-300',
    },
    {
      id: 'best-streak',
      label: 'BEST STREAK',
      value: `${bestStreak} Days`,
      subtext: 'Personal record',
      icon: Crown,
      tone: 'text-amber-200 bg-amber-400/10 border-amber-400/20',
      valueColor: 'text-amber-200',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="h-full"
          >
            <Card
              variant="glass"
              className="flex h-full flex-col justify-between border-white/10 p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="label-caps text-[0.62rem] text-slate-400">{card.label}</p>
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${card.tone}`}
                >
                  <Icon size={14} />
                </span>
              </div>
              <div className="mt-3">
                <p className={`font-mono text-xl font-bold tracking-tight ${card.valueColor}`}>
                  {card.value}
                </p>
                <p className="mt-0.5 text-[0.68rem] text-slate-500">{card.subtext}</p>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export default AnalyticsMetricCards
