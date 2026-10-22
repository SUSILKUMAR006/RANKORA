import { Calendar, CheckCircle2, Flame, Skull, Sparkles, Swords, Trophy, Zap } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import SystemWindow from '../common/SystemWindow.jsx'

function BossHeroCard({
  boss,
  currentHp,
  maxHp,
  hpPercentage,
  damageDealt,
  damagePercentage,
  isDefeated,
}) {
  const BossIcon = boss?.avatarTheme === 'amber' ? Zap : boss?.avatarTheme === 'violet' ? Flame : Skull

  return (
    <SystemWindow
      title="Red Gate"
      icon={<Skull size={13} />}
      tone="penalty"
      className="[--panel-glow:rgba(240,42,62,0.3)]"
      bodyClassName="p-0"
      actions={
        isDefeated ? (
          <Badge tone="success" className="shadow-[0_0_12px_-2px_rgba(52,217,156,0.5)]">
            <CheckCircle2 size={11} strokeWidth={3} /> Boss defeated
          </Badge>
        ) : (
          <Badge tone="danger" className="animate-sys-pulse shadow-[0_0_12px_-2px_rgba(240,42,62,0.6)]">
            <Swords size={11} /> Active battle
          </Badge>
        )
      }
    >
      <div className="relative overflow-hidden">
        {/* Red gate haze */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-penalty-500/10 to-transparent" />

        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          {/* Boss identity & crest */}
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative grid h-20 w-20 shrink-0 place-items-center sm:h-24 sm:w-24">
              <span
                className={`absolute inset-2 rotate-45 border ${
                  isDefeated
                    ? 'border-clear-400/70 bg-clear-500/10 shadow-[0_0_28px_-4px_rgba(52,217,156,0.55)]'
                    : 'border-penalty-400/80 bg-penalty-500/15 shadow-[0_0_32px_-4px_rgba(240,42,62,0.7)]'
                }`}
              />
              <span
                className={`absolute inset-0 rotate-45 border ${
                  isDefeated ? 'border-clear-400/20' : 'animate-sys-pulse border-penalty-400/30'
                }`}
              />
              <BossIcon
                size={38}
                strokeWidth={1.8}
                className={`relative ${
                  isDefeated
                    ? 'text-clear-300 drop-shadow-[0_0_8px_rgba(52,217,156,0.7)]'
                    : 'text-penalty-300 drop-shadow-[0_0_10px_rgba(255,77,94,0.8)]'
                }`}
              />
              {isDefeated && (
                <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center border border-clear-300 bg-clear-400 text-void-950 shadow-[0_0_10px_rgba(52,217,156,0.7)]">
                  <CheckCircle2 size={14} strokeWidth={3} />
                </span>
              )}
            </div>

            <div className="min-w-0 space-y-2">
              <p className="label-caps flex items-center gap-1.5 text-penalty-300">
                <Calendar size={12} className="text-penalty-400" />
                {boss?.weekLabel || 'Current Week'}
              </p>
              <h2 className="sys-title break-words text-4xl leading-none text-penalty-50 [text-shadow:0_0_18px_rgba(255,77,94,0.7),0_0_2px_rgba(255,77,94,0.9)] sm:text-5xl lg:text-6xl">
                {boss?.name}
              </h2>
              <p className="font-mono text-xs tracking-wide text-penalty-200">{boss?.title}</p>
              <p className="max-w-xl text-sm leading-6 text-frost-300">{boss?.description}</p>
            </div>
          </div>

          {/* Bounty */}
          <div className="flex items-center justify-between gap-4 rounded-xs border border-gold-500/40 bg-gold-950/40 px-4 py-3 shadow-[inset_0_0_20px_-8px_rgba(255,194,51,0.3)] sm:max-w-xs lg:w-52 lg:flex-col lg:items-end lg:text-right">
            <div>
              <p className="label-caps text-gold-300/80">Weekly bounty</p>
              <p className="mt-1 flex items-center gap-1.5 font-mono text-xl font-bold text-gold-300 sys-glow lg:justify-end">
                <Trophy size={18} />
                +1,000 XP
              </p>
            </div>
            <span className="label-caps shrink-0 border border-gold-400/40 bg-gold-500/10 px-2 py-1 text-gold-200">
              {isDefeated ? 'Reward Granted' : 'On Final Blow'}
            </span>
          </div>
        </div>

        {/* HP gauge */}
        <div className="relative border-t border-penalty-500/30 bg-penalty-950/30 p-5 sm:p-7">
          <div className="mb-2.5 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
            <p className="label-caps text-penalty-300">Boss health</p>
            <p className="font-mono text-sm text-frost-400">
              <span className="text-penalty-300">HP</span>{' '}
              <span className="text-xl font-bold text-frost-50">{currentHp.toLocaleString()}</span>
              <span className="text-frost-500"> / {maxHp.toLocaleString()}</span>
            </p>
          </div>

          <ProgressBar value={currentHp} max={maxHp} tone="boss" size="lg" className="w-full" />

          <p className="mt-2.5 font-mono text-xs">
            {isDefeated ? (
              <span className="flex items-center gap-1.5 font-semibold text-clear-300">
                <Sparkles size={13} /> Victory complete · 100% damage delivered
              </span>
            ) : (
              <span className="text-penalty-200">{currentHp} damage remaining to conquer</span>
            )}
          </p>

          {/* Raid stats */}
          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="sys-inset px-2 py-3 text-center">
              <p className="label-caps text-frost-500">HP left</p>
              <p className="mt-1 font-display text-2xl font-bold text-frost-50">
                {hpPercentage}
                <span className="text-sm text-frost-500">%</span>
              </p>
            </div>
            <div className="sys-inset px-2 py-3 text-center">
              <p className="label-caps text-frost-500">Dealt</p>
              <p className="mt-1 font-display text-2xl font-bold text-penalty-300">
                {damageDealt}
                <span className="ml-1 text-sm text-frost-500">DMG</span>
              </p>
            </div>
            <div className="sys-inset px-2 py-3 text-center">
              <p className="label-caps text-frost-500">Progress</p>
              <p className="mt-1 font-display text-2xl font-bold text-frost-50">
                {damagePercentage}
                <span className="text-sm text-frost-500">%</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </SystemWindow>
  )
}

export default BossHeroCard
