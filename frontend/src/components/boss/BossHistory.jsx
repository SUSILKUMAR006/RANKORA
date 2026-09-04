import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, History, Skull, Trophy, Zap } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Card from '../common/Card.jsx'

function formatHistoryDate(isoDate) {
  if (!isoDate) return 'Archived'
  try {
    const d = new Date(isoDate)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d)
  } catch {
    return 'Archived'
  }
}

function BossHistory({ history = [] }) {
  if (history.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <History size={16} className="text-cyan-300" />
          <h2 className="font-display text-lg font-semibold tracking-wide text-white">
            HALL OF FAME / BOSS HISTORY
          </h2>
        </div>
        <span className="font-mono text-xs text-slate-500">
          {history.length} Victories Recorded
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {history.map((entry, index) => (
          <motion.div
            key={entry.id || index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card
              variant="standard"
              className="flex flex-col justify-between border-white/10 bg-rankora-900/60 p-5 transition duration-200 hover:border-white/20 hover:bg-rankora-900/80"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                    <Skull size={20} />
                  </span>
                  <Badge tone="success" className="gap-1">
                    <CheckCircle2 size={10} strokeWidth={3} /> DEFEATED
                  </Badge>
                </div>

                <div className="mt-3">
                  <p className="label-caps text-[0.62rem] text-slate-500">
                    {entry.weekLabel || 'Past Cycle'}
                  </p>
                  <h3 className="mt-1 font-display text-base font-semibold text-white">
                    {entry.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {entry.title || 'Vanquished Entity'}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-white/5 pt-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Damage Dealt</span>
                  <span className="text-slate-200">
                    {entry.totalDamageDealt || entry.maxHp || 1000} HP
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Bounty Earned</span>
                  <span className="text-amber-300 font-semibold">
                    +{entry.xpAwarded || 1000} XP
                  </span>
                </div>
                <div className="flex items-center justify-between text-[0.68rem] text-slate-500">
                  <span>Fallen Date</span>
                  <span>{formatHistoryDate(entry.defeatedAt)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default BossHistory
