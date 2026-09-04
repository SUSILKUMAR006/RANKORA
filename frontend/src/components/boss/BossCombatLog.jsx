import { motion } from 'framer-motion'
import { Flame, ShieldAlert, Swords, Zap } from 'lucide-react'
import Card from '../common/Card.jsx'

function formatLogTime(timestamp) {
  if (!timestamp) return 'Recent'
  try {
    const d = new Date(timestamp)
    if (Number.isNaN(d.getTime())) return 'Recent'
    const now = new Date()
    const diffMs = now - d
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    const days = Math.floor(diffHours / 24)
    if (days === 1) return 'Yesterday'
    return `${days}d ago`
  } catch {
    return 'Recent'
  }
}

function BossCombatLog({ damageLog = [] }) {
  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-rose-400" />
          <h2 className="font-display text-sm font-semibold tracking-wide text-white">
            BATTLE COMBAT FEED
          </h2>
        </div>
        <span className="font-mono text-xs text-slate-500">
          {damageLog.length} Strikes Landed
        </span>
      </div>

      {damageLog.length > 0 ? (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {damageLog.map((entry, index) => (
            <motion.div
              key={entry.id || index}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs transition hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-400/10 text-rose-300 font-mono text-[0.65rem] font-bold">
                  <Swords size={13} />
                </span>
                <div className="min-w-0 truncate">
                  <p className="truncate font-medium text-white">
                    {entry.questTitle || 'Quest Objective Completed'}
                  </p>
                  <p className="label-caps text-[0.58rem] text-slate-500">
                    {entry.category || 'General'} · {formatLogTime(entry.timestamp)}
                  </p>
                </div>
              </div>

              <span className="shrink-0 font-mono text-xs font-bold text-rose-300 bg-rose-400/10 border border-rose-400/20 px-2 py-0.5 rounded-md">
                -{entry.damage} HP
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-slate-500">
          <ShieldAlert size={24} className="mx-auto mb-2 text-slate-600" />
          <p className="text-xs">No strikes landed yet this week.</p>
          <p className="mt-1 font-mono text-[0.68rem] text-slate-600">
            Complete daily quests to deal damage.
          </p>
        </div>
      )}
    </Card>
  )
}

export default BossCombatLog
