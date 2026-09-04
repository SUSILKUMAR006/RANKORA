import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Shield,
  Skull,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'

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
    <Card
      variant="highlighted"
      className="relative overflow-hidden border-rose-400/25 bg-gradient-to-br from-rose-950/40 via-rankora-900/90 to-rankora-950 p-6 sm:p-8"
    >
      {/* Dramatic Boss Aura & Particle Glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side: Boss Identity & Crest */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Animated Boss Icon Container */}
          <div className="relative flex shrink-0 items-center justify-center">
            <motion.div
              animate={
                isDefeated
                  ? { scale: [1, 1.05, 1], opacity: 0.6 }
                  : { scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }
              }
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute h-24 w-24 rounded-3xl blur-xl ${
                isDefeated ? 'bg-emerald-400/20' : 'bg-rose-500/25'
              }`}
            />
            <div
              className={`relative grid h-20 w-20 place-items-center rounded-3xl border text-white shadow-2xl transition-all duration-300 sm:h-24 sm:w-24 ${
                isDefeated
                  ? 'border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 via-rankora-900 to-rankora-950 text-emerald-300 shadow-[0_0_40px_rgba(52,211,153,0.2)]'
                  : 'border-rose-400/30 bg-gradient-to-br from-rose-500/20 via-rankora-900 to-rankora-950 text-rose-300 shadow-[0_0_50px_rgba(244,63,94,0.3)]'
              }`}
            >
              <BossIcon size={42} strokeWidth={1.8} />
              {isDefeated && (
                <div className="absolute -bottom-2 -right-2 grid h-7 w-7 place-items-center rounded-full bg-emerald-400 text-rankora-950 shadow-md">
                  <CheckCircle2 size={16} strokeWidth={3} />
                </div>
              )}
            </div>
          </div>

          {/* Boss Titles & Week Badge */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 font-mono text-[0.68rem] text-rose-300/80 uppercase tracking-widest">
                <Calendar size={12} className="text-rose-400" />
                {boss?.weekLabel || 'Current Week'}
              </span>

              {isDefeated ? (
                <Badge tone="success" className="gap-1 shadow-[0_0_15px_rgba(52,211,153,0.25)]">
                  <CheckCircle2 size={11} strokeWidth={3} /> BOSS DEFEATED
                </Badge>
              ) : (
                <Badge tone="danger" className="gap-1 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.25)]">
                  <Swords size={11} /> ACTIVE BATTLE
                </Badge>
              )}
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {boss?.name}
            </h1>
            <p className="font-mono text-xs text-rose-200/90 tracking-wide">
              {boss?.title}
            </p>
            <p className="max-w-xl text-xs leading-relaxed text-slate-400 sm:text-sm">
              {boss?.description}
            </p>
          </div>
        </div>

        {/* Right Side: Bounty Card */}
        <div className="flex shrink-0 flex-row items-center justify-between gap-4 rounded-2xl border border-rose-400/20 bg-black/30 p-4 sm:flex-col sm:items-end lg:w-48">
          <div>
            <p className="label-caps text-right text-rose-300/70">WEEKLY BOUNTY</p>
            <div className="mt-1 flex items-center justify-end gap-1.5 font-mono text-xl font-bold text-amber-300">
              <Trophy size={18} />
              <span>+1,000 XP</span>
            </div>
          </div>
          <span className="rounded-lg bg-amber-400/10 px-2.5 py-1 text-center font-mono text-[0.65rem] text-amber-200 uppercase tracking-wider">
            {isDefeated ? 'Reward Granted' : 'On Final Blow'}
          </span>
        </div>
      </div>

      {/* Dynamic Boss HP Bar Section */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-rose-300">
              BOSS HEALTH
            </span>
            <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[0.68rem] text-slate-400">
              {hpPercentage}% REMAINING
            </span>
          </div>
          <div className="font-mono text-xs">
            <span className="text-xl font-bold text-white">{currentHp.toLocaleString()}</span>
            <span className="text-slate-500"> / {maxHp.toLocaleString()} HP</span>
          </div>
        </div>

        {/* Glowing Progress Bar */}
        <div className="relative">
          <ProgressBar
            value={currentHp}
            max={maxHp}
            tone="boss"
            className="w-full"
          />
        </div>

        {/* HP Status Summary */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="text-slate-400">
            {isDefeated ? (
              <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                <Sparkles size={13} /> VICTORY COMPLETE · 100% DAMAGE DELIVERED
              </span>
            ) : (
              <span className="text-rose-300">
                {currentHp} DAMAGE REMAINING TO CONQUER
              </span>
            )}
          </span>
          <span className="text-slate-500">
            Total Dealt: <span className="text-slate-200">{damageDealt} DMG ({damagePercentage}%)</span>
          </span>
        </div>
      </div>
    </Card>
  )
}

export default BossHeroCard
