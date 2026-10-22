import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import ProgressBar from '../common/ProgressBar.jsx'
import SystemWindow from '../common/SystemWindow.jsx'

// Keys are the tone names coming from STAT_METADATA; values are System tokens.
const statToneStyles = {
  rose: {
    bg: 'border-penalty-400/50 bg-penalty-500/10 text-penalty-300',
    code: 'text-penalty-300',
    bar: 'boss',
  },
  emerald: {
    bg: 'border-clear-400/50 bg-clear-500/10 text-clear-300',
    code: 'text-clear-300',
    bar: 'quest',
  },
  violet: {
    bg: 'border-shadow-400/50 bg-shadow-500/10 text-shadow-300',
    code: 'text-shadow-300',
    bar: 'statistics',
  },
  cyan: {
    bg: 'border-system-400/50 bg-system-500/10 text-system-200',
    code: 'text-system-300',
    bar: 'xp',
  },
  amber: {
    bg: 'border-gold-400/50 bg-gold-500/10 text-gold-300',
    code: 'text-gold-300',
    bar: 'gold',
  },
}

function PlayerStatsGrid({ stats = [] }) {
  return (
    <SystemWindow
      title="Stats"
      icon={<Sparkles size={13} />}
      actions={<span className="label-caps hidden text-frost-500 sm:inline">5 pillars of momentum</span>}
    >
      <p className="label-caps mb-4 text-frost-500">Core attributes · character RPG stats</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const style = statToneStyles[stat.tone] || statToneStyles.cyan

          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="sys-inset flex h-full flex-col justify-between p-3.5 transition-colors hover:border-edge-strong sm:p-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-display text-lg font-bold tracking-[0.14em] ${style.code}`}>{stat.code}</p>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center border ${style.bg}`}>
                    <Icon size={16} />
                  </span>
                </div>

                <p className="mt-2 font-display text-5xl font-bold leading-none text-frost-50 sys-glow">{stat.value}</p>
                <p className="label-caps mt-2 text-frost-400">{stat.name}</p>
                <p className="mt-1 text-xs leading-5 text-frost-500">{stat.description}</p>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between font-mono text-[0.65rem] text-frost-500">
                  <span>Power level</span>
                  <span className="text-frost-300">{stat.progress}%</span>
                </div>
                <ProgressBar value={stat.progress} max={100} tone={style.bar} size="sm" className="w-full" />
              </div>
            </motion.div>
          )
        })}
      </div>
    </SystemWindow>
  )
}

export default PlayerStatsGrid
