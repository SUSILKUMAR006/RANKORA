import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import BossCombatLog from '../components/boss/BossCombatLog.jsx'
import BossDamageMatrix from '../components/boss/BossDamageMatrix.jsx'
import BossHeroCard from '../components/boss/BossHeroCard.jsx'
import BossHistory from '../components/boss/BossHistory.jsx'
import BossVictoryModal from '../components/boss/BossVictoryModal.jsx'
import { PageHeader } from '../components/common/SectionHeader.jsx'
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
      <PageHeader
        eyebrow="Combat codex ▸ Weekly challenge"
        title="Weekly Boss Battle"
        description="Channel your daily actions into devastating strikes. Each quest completed in real life weakens the boss until its core shatters."
        actions={
          <div className="flex items-center gap-2 border border-gold-400/50 bg-gold-500/10 px-3 py-2 font-mono text-xs text-gold-200">
            <Trophy size={14} className="text-gold-300" />
            <span>
              <span className="label-caps mr-1.5 text-gold-300/80">Bounty</span>
              +1,000 XP
            </span>
          </div>
        }
      />

      {/* Red gate: boss window */}
      <BossHeroCard
        boss={boss}
        currentHp={currentHp}
        maxHp={maxHp}
        hpPercentage={hpPercentage}
        damageDealt={damageDealt}
        damagePercentage={damagePercentage}
        isDefeated={isDefeated}
      />

      {/* Damage matrix & combat log */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <BossDamageMatrix isDefeated={isDefeated} />
        <BossCombatLog damageLog={boss?.damageLog || []} />
      </div>

      {/* Past raids */}
      <BossHistory history={history} />

      {/* System status footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-frost-600"
      >
        Rankora Combat Protocol · Damage Engine Active · Synced to Daily Quests
      </motion.p>

      {/* Victory pop-up */}
      <BossVictoryModal
        open={victoryModalOpen}
        boss={boss}
        onClose={() => setVictoryModalOpen(false)}
      />
    </div>
  )
}

export default BossPage
