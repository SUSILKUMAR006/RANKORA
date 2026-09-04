import { motion } from 'framer-motion'
import {
  Activity,
  Award,
  Camera,
  ChevronRight,
  Clock,
  Skull,
  Swords,
  Trophy,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../common/Card.jsx'
import { formatRelativeTime } from '../../utils/notificationUtils.js'

const toneStyles = {
  emerald: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  amber: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  rose: 'border-rose-400/25 bg-rose-400/10 text-rose-300',
  violet: 'border-violet-400/25 bg-violet-400/10 text-violet-300',
  cyan: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-200',
}

function PlayerRecentActivity({ activities = [] }) {
  return (
    <Card variant="glass" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-400/10 text-cyan-200">
            <Activity size={17} />
          </span>
          <div>
            <p className="label-caps text-cyan-300/80">CHRONOLOGICAL LOG</p>
            <h2 className="font-display text-base font-semibold text-white">
              RECENT ACTIVITY FEED
            </h2>
          </div>
        </div>

        <span className="font-mono text-xs text-slate-500">
          Realtime Codex Sync
        </span>
      </div>

      {activities && activities.length > 0 ? (
        <div className="divide-y divide-white/5">
          {activities.map((item, index) => {
            const Icon = item.icon || Swords
            const toneClass = toneStyles[item.tone] || toneStyles.cyan
            const targetLink = item.link || (item.type === 'quest' ? '/quests' : item.type === 'achievement' ? '/achievements' : '/analytics')

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Link
                  to={targetLink}
                  className="group flex items-center justify-between gap-4 py-3.5 transition hover:bg-white/[0.02] px-2 rounded-xl"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    {/* Event Icon */}
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${toneClass}`}
                    >
                      <Icon size={18} />
                    </span>

                    {/* Title & Subtitle */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-display text-sm font-semibold text-white group-hover:text-cyan-200">
                          {item.title}
                        </p>
                        <span className="hidden sm:inline-block rounded bg-white/5 px-2 py-0.5 font-mono text-[0.62rem] text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Relative Timestamp & Navigation Arrow */}
                  <div className="flex shrink-0 items-center gap-3 font-mono text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-[0.68rem]">
                      <Clock size={12} className="text-slate-600" />
                      {formatRelativeTime(item.timestamp)}
                    </span>
                    <span className="text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-cyan-200">
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="py-10 text-center text-slate-500 font-mono text-xs">
          No recent activity logs recorded yet. Complete daily quests to build your feed.
        </div>
      )}
    </Card>
  )
}

export default PlayerRecentActivity
