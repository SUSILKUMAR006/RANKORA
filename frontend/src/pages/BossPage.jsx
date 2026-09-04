import { motion } from 'framer-motion'
import { AlertCircle, Flame, Shield, Swords, Trophy, Zap } from 'lucide-react'
import BossCombatLog from '../components/boss/BossCombatLog.jsx'
import BossDamageMatrix from '../components/boss/BossDamageMatrix.jsx'
import BossHeroCard from '../components/boss/BossHeroCard.jsx'
import BossHistory from '../components/boss/BossHistory.jsx'
import BossVictoryModal from '../components/boss/BossVictoryModal.jsx'
import { useWeeklyBoss } from '../hooks/useWeeklyBoss.js'

function BossPage() {
  const {
    boss,
    history,
    maxHp,
    currentHp,
    hpPercentage,
    damageDealt,
    damagePercentage,
    isDefeated,
    victoryModalOpen,
    setVictoryModalOpen,
  } = useWeeklyBoss()

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-rose-500/10 text-rose-300">
              <Flame size={14} />
            </span>
            <p className="label-caps text-rose-300/80">COMBAT CODEX / WEEKLY CHALLENGE</p>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            WEEKLY BOSS BATTLE
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Channel your daily actions into devastating strikes. Each quest completed in
            real life weakens the boss until its core shatters.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/5 px-3.5 py-2 font-mono text-xs text-rose-200">
          <Trophy size={14} className="text-amber-300" />
          <span>Bounty Reward: +1,000 XP</span>
        </div>
      </motion.header>

      {/* Cinematic Boss Battle Card */}
      <BossHeroCard
        boss={boss}
        currentHp={currentHp}
        maxHp={maxHp}
        hpPercentage={hpPercentage}
        damageDealt={damageDealt}
        damagePercentage={damagePercentage}
        isDefeated={isDefeated}
      />

      {/* Combat Matrix & Live Battle Log Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <BossDamageMatrix isDefeated={isDefeated} />
        <BossCombatLog damageLog={boss?.damageLog || []} />
      </div>

      {/* Hall of Fame / Past Victories */}
      <BossHistory history={history} />

      {/* System Status Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-700"
      >
        Rankora Combat Protocol · Damage Engine Active · Synced to Daily Quests
      </motion.p>

      {/* Victory Fanfare Modal */}
      <BossVictoryModal
        open={victoryModalOpen}
        boss={boss}
        onClose={() => setVictoryModalOpen(false)}
      />
    </div>
  )
}

export default BossPage
