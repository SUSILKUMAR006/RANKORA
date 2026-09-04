import { motion } from 'framer-motion'
import { Award, Dumbbell, Shield, Sparkles } from 'lucide-react'
import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'

const statToneStyles = {
  rose: {
    bg: 'bg-rose-400/10 border-rose-400/25 text-rose-300',
    bar: 'boss',
  },
  emerald: {
    bg: 'bg-emerald-400/10 border-emerald-400/25 text-emerald-300',
    bar: 'quest',
  },
  violet: {
    bg: 'bg-violet-400/10 border-violet-400/25 text-violet-300',
    bar: 'statistics',
  },
  cyan: {
    bg: 'bg-cyan-400/10 border-cyan-400/25 text-cyan-200',
    bar: 'xp',
  },
  amber: {
    bg: 'bg-amber-400/10 border-amber-400/25 text-amber-300',
    bar: 'boss',
  },
}

function PlayerStatsGrid({ stats = [] }) {
  return (
    <Card variant="glass" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-400/10 text-cyan-200">
            <Sparkles size={17} />
          </span>
          <div>
            <p className="label-caps text-cyan-300/80">CORE ATTRIBUTES</p>
            <h2 className="font-display text-base font-semibold text-white">
              CHARACTER RPG STATS
            </h2>
          </div>
        </div>

        <span className="font-mono text-xs text-slate-500">
          5 Pillars of Momentum
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const style = statToneStyles[stat.tone] || statToneStyles.cyan

          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div>
                {/* Header: Icon & Code */}
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${style.bg}`}
                  >
                    <Icon size={19} />
                  </span>
                  <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-xs font-bold text-white">
                    {stat.code}
                  </span>
                </div>

                {/* Name & Value */}
                <div className="mt-4">
                  <p className="label-caps text-[0.62rem] text-slate-500">{stat.name}</p>
                  <p className="font-mono text-2xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[0.72rem] leading-relaxed text-slate-400">
                    {stat.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-5 space-y-1.5 border-t border-white/5 pt-3">
                <div className="flex justify-between font-mono text-[0.65rem] text-slate-500">
                  <span>Power Level</span>
                  <span>{stat.progress}%</span>
                </div>
                <ProgressBar
                  value={stat.progress}
                  max={100}
                  tone={style.bar}
                  className="w-full"
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}

export default PlayerStatsGrid
