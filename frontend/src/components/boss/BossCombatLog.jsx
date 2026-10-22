import { motion } from 'framer-motion'
import { Flame, ShieldAlert } from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'

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

// Display-only: the "[12:04]" clock stamp at the start of each System log line.
function formatLogClock(timestamp) {
  if (!timestamp) return '--:--'
  const d = new Date(timestamp)
  if (Number.isNaN(d.getTime())) return '--:--'
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function BossCombatLog({ damageLog = [] }) {
  return (
    <SystemWindow
      title="Combat Log"
      icon={<Flame size={13} />}
      tone="penalty"
      bodyClassName="p-0"
      actions={<span className="font-mono text-xs text-frost-500">[{damageLog.length}] strikes</span>}
    >
      {damageLog.length > 0 ? (
        <div className="max-h-80 divide-y divide-edge/40 overflow-y-auto font-mono text-xs">
          {damageLog.map((entry, index) => (
            <motion.div
              key={entry.id || index}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(index, 12) * 0.03 }}
              className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-penalty-500/5 sm:px-5"
            >
              <span className="shrink-0 text-frost-600">[{formatLogClock(entry.timestamp)}]</span>
              <div className="min-w-0 flex-1">
                <p className="text-frost-200">
                  You dealt <span className="font-bold text-penalty-300">{entry.damage}</span> damage.
                </p>
                <p className="mt-0.5 truncate text-[0.7rem] text-frost-500">
                  <span className="text-frost-300">{entry.questTitle || 'Quest Objective Completed'}</span>
                  {' · '}
                  {entry.category || 'General'} · {formatLogTime(entry.timestamp)}
                </p>
              </div>
              <span className="shrink-0 font-bold text-penalty-300">-{entry.damage} HP</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="px-5 py-10 text-center font-mono text-xs">
          <ShieldAlert size={22} className="mx-auto mb-3 text-penalty-400/60" />
          <p className="text-frost-300">&gt; No strikes landed yet this week.</p>
          <p className="mt-1 text-frost-500">
            Complete daily quests to deal damage.
            <span className="ml-1 animate-sys-pulse text-penalty-300">_</span>
          </p>
        </div>
      )}
    </SystemWindow>
  )
}

export default BossCombatLog
