import { motion } from 'framer-motion'
import { Calendar, Check, Lock, Sparkles, Trophy } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import { formatUnlockDate } from '../../utils/achievementUtils.js'

const rarityTones = {
  Common: 'border-cyan-400/25 text-cyan-200 bg-cyan-400/10',
  Rare: 'border-violet-400/25 text-violet-200 bg-violet-400/10',
  Epic: 'border-rose-400/25 text-rose-200 bg-rose-400/10',
  Legendary: 'border-amber-400/30 text-amber-200 bg-amber-400/15 shadow-[0_0_20px_rgba(251,191,36,0.15)]',
}

const colorMap = {
  cyan: {
    unlockedBg: 'bg-cyan-400/10 border-cyan-300/30 text-cyan-200 shadow-[0_0_24px_rgba(103,232,249,0.2)]',
    barTone: 'xp',
  },
  amber: {
    unlockedBg: 'bg-amber-400/10 border-amber-300/30 text-amber-200 shadow-[0_0_24px_rgba(251,191,36,0.2)]',
    barTone: 'boss',
  },
  rose: {
    unlockedBg: 'bg-rose-400/10 border-rose-300/30 text-rose-200 shadow-[0_0_24px_rgba(251,113,133,0.2)]',
    barTone: 'boss',
  },
  violet: {
    unlockedBg: 'bg-violet-400/10 border-violet-300/30 text-violet-200 shadow-[0_0_24px_rgba(167,139,250,0.2)]',
    barTone: 'statistics',
  },
  emerald: {
    unlockedBg: 'bg-emerald-400/10 border-emerald-300/30 text-emerald-200 shadow-[0_0_24px_rgba(52,211,153,0.2)]',
    barTone: 'quest',
  },
}

function AchievementCard({ achievement }) {
  const {
    name,
    description,
    category,
    icon: Icon = Trophy,
    target,
    current = 0,
    unit = '',
    points = 50,
    rarity = 'Common',
    color = 'cyan',
    isUnlocked = false,
    unlockedAt,
    percentage = 0,
  } = achievement

  const formattedDate = formatUnlockDate(unlockedAt)
  const styling = colorMap[color] || colorMap.cyan

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        variant={isUnlocked ? 'highlighted' : 'standard'}
        className={`relative flex h-full flex-col justify-between overflow-hidden transition duration-300 ${
          isUnlocked
            ? 'border-cyan-300/25 bg-gradient-to-br from-rankora-900/95 via-rankora-900/80 to-rankora-950/90 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-cyan-300/50 hover:shadow-[0_0_35px_rgba(103,232,249,0.15)]'
            : 'border-white/5 bg-rankora-950/60 opacity-80 backdrop-blur-sm hover:border-white/15 hover:opacity-100'
        }`}
      >
        {/* Subtle Ambient Glow for Unlocked Cards */}
        {isUnlocked && (
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-2xl" />
        )}

        <div>
          {/* Card Top Header */}
          <div className="flex items-start justify-between gap-3">
            {/* Icon Container */}
            <div
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border transition-all duration-300 ${
                isUnlocked
                  ? styling.unlockedBg
                  : 'border-white/10 bg-white/[0.03] text-slate-600'
              }`}
            >
              <Icon size={22} strokeWidth={isUnlocked ? 2.2 : 1.5} />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] ${
                  rarityTones[rarity] || rarityTones.Common
                }`}
              >
                {rarity}
              </span>

              {isUnlocked ? (
                <Badge tone="success" className="gap-1 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
                  <Check size={11} strokeWidth={3} /> UNLOCKED
                </Badge>
              ) : (
                <Badge tone="category" className="gap-1 border-white/10 bg-white/[0.03] text-slate-500">
                  <Lock size={10} /> LOCKED
                </Badge>
              )}
            </div>
          </div>

          {/* Title & Category */}
          <div className="mt-4">
            <div className="flex items-center justify-between gap-2">
              <p className="label-caps text-[0.62rem] text-slate-500">{category}</p>
              <span className="font-mono text-xs font-semibold text-amber-200/90">
                +{points} AP
              </span>
            </div>
            <h3
              className={`mt-1 font-display text-base font-semibold tracking-wide transition-colors ${
                isUnlocked ? 'text-white' : 'text-slate-400'
              }`}
            >
              {name}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              {description}
            </p>
          </div>
        </div>

        {/* Card Footer: Progress or Unlock Date */}
        <div className="mt-6 border-t border-white/5 pt-4">
          {isUnlocked ? (
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-mono text-emerald-300">
                <Sparkles size={13} className="text-emerald-400" />
                Completed ({target} {unit})
              </span>
              {formattedDate && (
                <span className="flex items-center gap-1 font-mono text-[0.68rem] text-slate-400">
                  <Calendar size={12} className="text-slate-500" />
                  {formattedDate}
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-500">Progress</span>
                <span className="text-slate-300">
                  {Math.min(target, current).toLocaleString()} / {target.toLocaleString()}{' '}
                  <span className="text-[0.68rem] text-slate-500">{unit}</span>
                </span>
              </div>
              <ProgressBar
                value={percentage}
                max={100}
                tone={styling.barTone}
                className="w-full"
              />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default AchievementCard
