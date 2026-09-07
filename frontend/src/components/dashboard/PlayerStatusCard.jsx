import { Flame, Sparkles, Target } from 'lucide-react'
import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import RankBadge from '../player/RankBadge.jsx'

function PlayerStatusCard({ player }) {
  const current = player || {}
  const requiredXp = 1500
  const xp = Number(current.xp) || 0
  const remaining = Math.max(0, requiredXp - xp)
  const playerName = current.playerName || 'PLAYER'
  const level = current.level || 1
  const rank = current.rank || 'E'
  const streak = current.currentStreak || 0
  const bestStreak = current.bestStreak || streak

  return (
    <Card variant="highlighted" className="relative overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr_0.8fr] lg:items-center">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-[0_0_38px_rgba(103,232,249,0.14)] sm:h-24 sm:w-24">
            <Sparkles size={32} />
          </div>
          <div>
            <p className="label-caps text-cyan-300/70">Player status</p>
            <h2 className="mt-2 truncate font-display text-2xl font-semibold text-white">
              {playerName}
            </h2>
            <p className="mt-2 font-mono text-xs text-slate-500">
              LEVEL {level} <span className="mx-2 text-slate-700">/</span> RANK {rank}
            </p>
          </div>
        </div>
        <div>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="label-caps text-slate-500">Experience</p>
              <p className="mt-1 font-mono text-2xl text-white">
                {xp.toLocaleString()} <span className="text-sm text-slate-500">/ {requiredXp.toLocaleString()} XP</span>
              </p>
            </div>
            <RankBadge rank={rank} size="md" />
          </div>
          <ProgressBar value={xp} max={requiredXp} tone="xp" />
          <p className="mt-2 font-mono text-xs text-cyan-200">{remaining} XP TO NEXT LEVEL</p>
        </div>
        <div className="flex gap-3 border-t border-white/10 pt-5 lg:block lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="flex items-center gap-3">
            <Flame className="text-orange-300" size={22} />
            <div>
              <p className="label-caps text-slate-500">Current streak</p>
              <p className="font-mono text-xl text-white">
                {streak} <span className="text-sm text-slate-500">days</span>
              </p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <Target size={14} /> BEST: {bestStreak} DAYS
          </p>
        </div>
      </div>
    </Card>
  )
}
export default PlayerStatusCard
