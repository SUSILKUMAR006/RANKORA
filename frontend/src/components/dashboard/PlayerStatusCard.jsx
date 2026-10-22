import { Flame, Target } from 'lucide-react'
import ProgressBar from '../common/ProgressBar.jsx'
import SystemWindow from '../common/SystemWindow.jsx'
import RankBadge from '../player/RankBadge.jsx'
import { getEffectiveStreak } from '../../utils/xpUtils.js'

const statOrder = [
  ['str', 'STR'],
  ['vit', 'VIT'],
  ['agi', 'AGI'],
  ['int', 'INT'],
  ['disc', 'DISC'],
]

const rankTitles = {
  E: 'E-Rank Hunter',
  D: 'D-Rank Hunter',
  C: 'C-Rank Hunter',
  B: 'B-Rank Hunter',
  A: 'A-Rank Hunter',
  S: 'S-Rank Hunter',
}

function PlayerStatusCard({ player }) {
  const current = player || {}
  const requiredXp = 1500
  const xp = Number(current.xp) || 0
  const remaining = Math.max(0, requiredXp - xp)
  const playerName = current.playerName || 'PLAYER'
  const level = current.level || 1
  const rank = current.rank || 'E'
  const streak = getEffectiveStreak(current)
  const bestStreak = current.bestStreak || streak
  const stats = current.stats || {}

  return (
    <SystemWindow title="Status" align="center" className="[--panel-glow:rgba(30,144,255,0.26)]" bodyClassName="p-0">
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        {/* Identity */}
        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="font-display text-6xl font-bold leading-none text-frost-50 sys-glow sm:text-7xl">{level}</p>
              <p className="label-caps mt-1 text-system-300">Level</p>
            </div>
            <div className="h-16 w-px bg-linear-to-b from-transparent via-edge-strong to-transparent" />
            <dl className="grid min-w-0 flex-1 grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <dt className="label-caps self-center text-frost-500">Name</dt>
              <dd className="truncate font-display text-lg font-bold uppercase tracking-[0.08em] text-frost-50">{playerName}</dd>
              <dt className="label-caps self-center text-frost-500">Job</dt>
              <dd className="text-frost-200">Player</dd>
              <dt className="label-caps self-center text-frost-500">Title</dt>
              <dd className="text-frost-200">{rankTitles[rank] || rankTitles.E}</dd>
            </dl>
            <div className="hidden sm:block">
              <RankBadge rank={rank} size="lg" />
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <p className="label-caps text-system-300">EXP</p>
              <p className="font-mono text-sm text-frost-200">
                {xp.toLocaleString()} <span className="text-frost-500">/ {requiredXp.toLocaleString()}</span>
              </p>
            </div>
            <ProgressBar value={xp} max={requiredXp} tone="xp" size="lg" />
            <p className="mt-2 font-mono text-xs text-system-200">{remaining.toLocaleString()} EXP to next level</p>
          </div>
        </div>

        {/* Stats + streak */}
        <div className="border-t border-edge p-5 sm:p-7 lg:border-l lg:border-t-0">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {statOrder.map(([key, label]) => (
              <div key={key} className="sys-inset px-1 py-3 text-center">
                <p className="label-caps text-frost-500">{label}</p>
                <p className="mt-1 font-display text-2xl font-bold text-frost-50">{Number(stats[key]) || 0}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="sys-inset flex items-center gap-3 px-4 py-3">
              <Flame className="text-ember-400 drop-shadow-[0_0_6px_rgba(255,138,61,0.7)]" size={22} />
              <div>
                <p className="label-caps text-frost-500">Streak</p>
                <p className="font-display text-2xl font-bold leading-none text-frost-50">
                  {streak} <span className="text-sm font-semibold text-frost-500">days</span>
                </p>
              </div>
            </div>
            <div className="sys-inset flex items-center gap-3 px-4 py-3">
              <Target className="text-gold-400" size={20} />
              <div>
                <p className="label-caps text-frost-500">Best</p>
                <p className="font-display text-2xl font-bold leading-none text-frost-50">
                  {bestStreak} <span className="text-sm font-semibold text-frost-500">days</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SystemWindow>
  )
}

export default PlayerStatusCard
