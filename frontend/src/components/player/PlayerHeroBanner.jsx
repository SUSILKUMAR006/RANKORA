import { motion } from 'framer-motion'
import {
  Brain,
  CheckCircle2,
  Dumbbell,
  Flame,
  HeartPulse,
  Percent,
  Settings,
  Sparkles,
  Swords,
  Target,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import RankBadge from './RankBadge.jsx'

const avatarIcons = {
  solar: Sparkles,
  forge: Dumbbell,
  oracle: Brain,
  pulse: HeartPulse,
}

function PlayerHeroBanner({ data }) {
  const player = data?.player || {}
  const metrics = data?.metrics || {}

  const level = Number(player.level) || 1
  const currentXp = Number(player.xp) || 0
  const requiredXp = Number(player.requiredXp) || 100
  const remainingXp = Number(player.remainingXp) || Math.max(0, requiredXp - currentXp)
  const xpPercentage = Number(player.xpPercentage) || Math.min(100, Math.round((currentXp / requiredXp) * 100))

  const totalQuests = Number(metrics.totalQuests) || 0
  const completedQuests = Number(metrics.completedQuests) || 0
  const failedQuests = Number(metrics.failedQuests) || 0
  const successRate = Number(metrics.successRate) || (totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0)

  const currentStreak = Number(player.currentStreak) || 0
  const bestStreak = Number(player.bestStreak) || 0

  const AvatarIcon = avatarIcons[player.avatar] || Sparkles

  return (
    <Card
      variant="highlighted"
      className="relative overflow-hidden border-cyan-300/30 bg-gradient-to-br from-rankora-900 via-rankora-900/90 to-rankora-950 p-6 sm:p-8 shadow-2xl"
    >
      {/* Background Neon Ambient Glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side: Avatar, Name, Rank, Level, Path */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Avatar Crest */}
          <div className="relative flex shrink-0 items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute h-24 w-24 rounded-3xl bg-cyan-400/20 blur-xl"
            />
            <div className="relative grid h-20 w-20 place-items-center rounded-3xl border border-cyan-300/40 bg-gradient-to-br from-cyan-400/20 via-rankora-900 to-rankora-950 text-cyan-200 shadow-[0_0_40px_rgba(103,232,249,0.25)] sm:h-24 sm:w-24">
              <AvatarIcon size={38} strokeWidth={2} />
              <div className="absolute -bottom-2 -right-2">
                <RankBadge rank={player.rank || 'E'} size="sm" />
              </div>
            </div>
          </div>

          {/* Identity & Badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-200">
                LEVEL {level}
              </span>
              <span className="text-slate-600">·</span>
              <Badge tone="rank">RANK {player.rank || 'E'}</Badge>
              <Badge tone="category" className="capitalize">
                {player.primaryPath || 'Balanced'} Path
              </Badge>
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {player.playerName || 'PLAYER'}
            </h1>

            {/* Streak Counter */}
            <div className="flex items-center gap-4 font-mono text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-orange-300 font-semibold">
                <Flame size={15} />
                {currentStreak} Day Streak
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Target size={14} className="text-amber-300" />
                Best: {bestStreak} Days
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action to Settings */}
        <div className="flex shrink-0 items-center justify-end">
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 font-mono text-xs font-semibold text-slate-300 transition hover:border-cyan-300/40 hover:bg-white/[0.08] hover:text-white"
          >
            <Settings size={15} />
            <span>EDIT PROFILE</span>
          </Link>
        </div>
      </div>

      {/* Experience Progression Bar */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
              LEVEL PROGRESSION
            </span>
            <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[0.68rem] text-slate-400">
              {xpPercentage}% TO LEVEL {level + 1}
            </span>
          </div>
          <div className="font-mono text-xs">
            <span className="text-xl font-bold text-white">{currentXp.toLocaleString()}</span>
            <span className="text-slate-500"> / {requiredXp.toLocaleString()} XP</span>
          </div>
        </div>

        <ProgressBar value={currentXp} max={requiredXp} tone="xp" className="w-full" />

        <div className="mt-2.5 flex items-center justify-between font-mono text-xs text-slate-500">
          <span className="text-cyan-200">{remainingXp} XP remaining to ascend</span>
          <span>Next Rank Threshold: {level >= 20 ? 'S Rank' : level >= 15 ? 'A Rank' : level >= 10 ? 'B Rank' : level >= 5 ? 'C Rank' : 'D Rank'}</span>
        </div>
      </div>

      {/* 4-Metric Reliability Summary Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-white/5 pt-5">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
          <p className="label-caps text-[0.6rem] text-slate-500">Total Quests</p>
          <p className="mt-1 font-mono text-xl font-bold text-white">{totalQuests}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
          <p className="label-caps text-[0.6rem] text-slate-500">Completed</p>
          <p className="mt-1 font-mono text-xl font-bold text-emerald-300">{completedQuests}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
          <p className="label-caps text-[0.6rem] text-slate-500">Failed</p>
          <p className="mt-1 font-mono text-xl font-bold text-rose-300">{failedQuests}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
          <p className="label-caps text-[0.6rem] text-slate-500">Success Rate</p>
          <p className="mt-1 font-mono text-xl font-bold text-violet-300">{successRate}%</p>
        </div>
      </div>
    </Card>
  )
}

export default PlayerHeroBanner
