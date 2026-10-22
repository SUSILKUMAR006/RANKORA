import { motion } from 'framer-motion'
import { CheckCircle2, History, Skull, XCircle } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import SystemWindow from '../common/SystemWindow.jsx'

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
    <SystemWindow
      title="Raid History"
      icon={<History size={13} />}
      bodyClassName="p-0"
      actions={<span className="font-mono text-xs text-frost-500">[{history.length}] records</span>}
    >
      <p className="label-caps border-b border-edge/70 px-5 py-3 text-frost-500">Hall of fame · past gates</p>

      <div className="divide-y divide-edge/60">
        {history.map((entry, index) => {
          // Display only: archived entries without a DEFEATED status were gates left uncleared.
          const cleared = !entry.status || entry.status === 'DEFEATED'
          return (
            <motion.div
              key={entry.id || index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(index, 8) * 0.05 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 transition-colors hover:bg-system-500/5"
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center border ${
                  cleared
                    ? 'border-clear-400/60 bg-clear-500/10 text-clear-300 shadow-[0_0_10px_rgba(52,217,156,0.3)]'
                    : 'border-penalty-400/60 bg-penalty-500/10 text-penalty-300'
                }`}
              >
                <Skull size={18} />
              </span>

              <div className="min-w-0 flex-1 basis-40">
                <p className="label-caps text-frost-600">{entry.weekLabel || 'Past Cycle'}</p>
                <h3 className="truncate font-display text-base font-bold uppercase tracking-[0.08em] text-frost-50">
                  {entry.name}
                </h3>
                <p className="truncate text-xs text-frost-400">{entry.title || 'Vanquished Entity'}</p>
              </div>

              <dl className="grid grid-cols-3 gap-x-4 gap-y-0.5 font-mono text-xs sm:flex sm:items-center sm:gap-5">
                <div>
                  <dt className="label-caps text-frost-600">Damage</dt>
                  <dd className="text-frost-200">
                    {cleared ? entry.totalDamageDealt || entry.maxHp || 1000 : entry.totalDamageDealt ?? 0} HP
                  </dd>
                </div>
                <div>
                  <dt className="label-caps text-frost-600">Bounty</dt>
                  {cleared ? (
                    <dd className="font-semibold text-gold-300">+{entry.xpAwarded || 1000} XP</dd>
                  ) : (
                    <dd className="text-frost-500">None</dd>
                  )}
                </div>
                <div>
                  <dt className="label-caps text-frost-600">Date</dt>
                  <dd className="text-frost-400">{formatHistoryDate(entry.defeatedAt)}</dd>
                </div>
              </dl>

              {cleared ? (
                <Badge tone="success" className="shrink-0">
                  <CheckCircle2 size={10} strokeWidth={3} /> Cleared
                </Badge>
              ) : (
                <Badge tone="danger" className="shrink-0">
                  <XCircle size={10} strokeWidth={3} /> Failed
                </Badge>
              )}
            </motion.div>
          )
        })}
      </div>
    </SystemWindow>
  )
}

export default BossHistory
