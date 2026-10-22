import { Brain, Dumbbell, Flame, HeartPulse, Settings, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProgressBar from '../common/ProgressBar.jsx'
import SystemWindow from '../common/SystemWindow.jsx'
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
  const rank = player.rank || 'E'

  const metricTiles = [
    { label: 'Total Quests', value: totalQuests, tone: 'text-frost-50' },
    { label: 'Completed', value: completedQuests, tone: 'text-clear-300' },
    { label: 'Failed', value: failedQuests, tone: 'text-penalty-300' },
    { label: 'Success Rate', value: `${successRate}%`, tone: 'text-shadow-300' },
  ]

  return (
    <SystemWindow
      title="Status"
      tone="shadow"
      className="[--panel-glow:rgba(127,69,245,0.28)]"
      bodyClassName="p-0"
      actions={
        <Link
          to="/settings"
          className="label-caps inline-flex items-center gap-1.5 border border-edge-strong bg-void-850/80 px-2.5 py-1.5 text-frost-300 transition-colors hover:border-shadow-400 hover:text-frost-50"
        >
          <Settings size={13} />
          Edit profile
        </Link>
      }
    >
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        {/* Identity + EXP */}
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-5 sm:flex-nowrap">
            <div className="flex items-center gap-5">
              <RankBadge rank={rank} size="xl" />
              <div className="text-center">
                <p className="font-display text-6xl font-bold leading-none text-frost-50 [text-shadow:0_0_18px_rgba(155,107,255,0.75)] sm:text-7xl">
                  {level}
                </p>
                <p className="label-caps mt-1 text-shadow-300">Level</p>
              </div>
            </div>

            <div className="hidden h-20 w-px bg-linear-to-b from-transparent via-shadow-500/60 to-transparent sm:block" />

            <dl className="grid min-w-0 flex-1 basis-56 grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <dt className="label-caps self-center text-frost-500">Name</dt>
              <dd className="flex min-w-0 items-center gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center border border-shadow-400/60 bg-shadow-500/15 text-shadow-200 shadow-[0_0_10px_-2px_rgba(155,107,255,0.6)]">
                  <AvatarIcon size={13} />
                </span>
                <span className="truncate font-display text-lg font-bold uppercase tracking-[0.08em] text-frost-50">
                  {player.playerName || 'PLAYER'}
                </span>
              </dd>
              <dt className="label-caps self-center text-frost-500">Job</dt>
              <dd className="text-frost-200">Player</dd>
              <dt className="label-caps self-center text-frost-500">Title</dt>
              <dd className="text-frost-200">{rank}-Rank Hunter</dd>
              <dt className="label-caps self-center text-frost-500">Path</dt>
              <dd className="capitalize text-shadow-200">{player.primaryPath || 'Balanced'} Path</dd>
            </dl>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="label-caps text-system-300">
                EXP <span className="ml-1.5 font-mono text-[0.7rem] tracking-normal text-frost-500">{xpPercentage}% to level {level + 1}</span>
              </p>
              <p className="font-mono text-sm text-frost-200">
                {currentXp.toLocaleString()} <span className="text-frost-500">/ {requiredXp.toLocaleString()} XP</span>
              </p>
            </div>
            <ProgressBar value={currentXp} max={requiredXp} tone="xp" size="lg" className="w-full" />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-xs">
              <span className="text-system-200">{remainingXp} XP remaining to ascend</span>
              <span className="text-frost-500">
                Next rank threshold:{' '}
                <span className="text-gold-300">
                  {level >= 20 ? 'S Rank' : level >= 15 ? 'A Rank' : level >= 10 ? 'B Rank' : level >= 5 ? 'C Rank' : 'D Rank'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Streak + reliability */}
        <div className="border-t border-shadow-500/25 p-5 sm:p-7 lg:border-l lg:border-t-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="sys-inset flex items-center gap-3 px-4 py-3">
              <Flame className="shrink-0 text-ember-400 drop-shadow-[0_0_6px_rgba(255,138,61,0.7)]" size={22} />
              <div>
                <p className="label-caps text-frost-500">Streak</p>
                <p className="font-display text-2xl font-bold leading-none text-frost-50">
                  {currentStreak} <span className="text-sm font-semibold text-frost-500">days</span>
                </p>
              </div>
            </div>
            <div className="sys-inset flex items-center gap-3 px-4 py-3">
              <Target className="shrink-0 text-gold-400" size={20} />
              <div>
                <p className="label-caps text-frost-500">Best</p>
                <p className="font-display text-2xl font-bold leading-none text-frost-50">
                  {bestStreak} <span className="text-sm font-semibold text-frost-500">days</span>
                </p>
              </div>
            </div>
          </div>

          <p className="label-caps mb-2 mt-5 text-frost-600">Quest record</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-2">
            {metricTiles.map((tile) => (
              <div key={tile.label} className="sys-inset px-2 py-3 text-center">
                <p className="label-caps text-frost-500">{tile.label}</p>
                <p className={`mt-1 font-display text-2xl font-bold ${tile.tone}`}>{tile.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SystemWindow>
  )
}

export default PlayerHeroBanner
