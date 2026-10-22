import { motion } from 'framer-motion'
import { Activity, ChevronRight, Clock, ScanLine, Swords } from 'lucide-react'
import { Link } from 'react-router-dom'
import SystemWindow from '../common/SystemWindow.jsx'
import { formatRelativeTime } from '../../utils/notificationUtils.js'

// Keys are the tone names coming from profile activity data; values are System tokens.
const toneStyles = {
  emerald: 'border-clear-400/60 bg-clear-500/10 text-clear-300',
  amber: 'border-gold-400/60 bg-gold-500/10 text-gold-300',
  rose: 'border-penalty-400/60 bg-penalty-500/10 text-penalty-300',
  violet: 'border-shadow-400/60 bg-shadow-500/10 text-shadow-300',
  cyan: 'border-system-400/60 bg-system-500/10 text-system-200',
}

function PlayerRecentActivity({ activities = [] }) {
  return (
    <SystemWindow
      title="Recent Activity"
      icon={<Activity size={13} />}
      bodyClassName="p-0"
      actions={
        <span className="label-caps hidden items-center gap-1.5 text-frost-500 sm:inline-flex">
          <span className="h-1.5 w-1.5 animate-sys-pulse rotate-45 bg-system-400 shadow-[0_0_6px_rgba(74,174,255,0.9)]" />
          Realtime codex sync
        </span>
      }
    >
      <p className="label-caps border-b border-edge/70 px-5 py-3 text-frost-500">Chronological log</p>

      {activities && activities.length > 0 ? (
        <div className="divide-y divide-edge/60">
          {activities.map((item, index) => {
            const Icon = item.icon || Swords
            const toneClass = toneStyles[item.tone] || toneStyles.cyan
            const targetLink = item.link || (item.type === 'quest' ? '/quests' : item.type === 'achievement' ? '/achievements' : '/analytics')

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Link
                  to={targetLink}
                  className="group flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-system-500/5 sm:gap-4 sm:px-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center border ${toneClass}`}>
                      <Icon size={16} />
                    </span>

                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate font-display text-sm font-bold uppercase tracking-[0.08em] text-frost-50 transition-colors group-hover:text-system-200">
                          {item.title}
                        </p>
                        <span className="label-caps hidden shrink-0 text-frost-600 sm:inline">{item.category}</span>
                      </div>
                      <p className="mt-0.5 truncate font-mono text-xs text-frost-400">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 font-mono text-[0.68rem] text-frost-500 sm:gap-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="hidden text-frost-600 sm:block" />
                      {formatRelativeTime(item.timestamp)}
                    </span>
                    <ChevronRight
                      size={15}
                      className="text-frost-600 transition-transform group-hover:translate-x-0.5 group-hover:text-system-200"
                    />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="px-5 py-10 text-center font-mono text-xs text-frost-500">
          <ScanLine size={22} className="mx-auto mb-3 text-system-400/60" />
          No recent activity logs recorded yet. Complete daily quests to build your feed.
        </div>
      )}
    </SystemWindow>
  )
}

export default PlayerRecentActivity
