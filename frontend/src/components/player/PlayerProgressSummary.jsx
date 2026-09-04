import { motion } from 'framer-motion'
import {
  Award,
  BookOpen,
  Camera,
  ChevronRight,
  Flame,
  LineChart,
  Shield,
  Skull,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../common/Card.jsx'

function PlayerProgressSummary({ summary = {} }) {
  const totalXp = Number(summary.totalXp) || 0
  const achievementsUnlocked = Number(summary.achievementsUnlocked) || 0
  const totalAchievements = Number(summary.totalAchievements) || 0
  const bossesDefeated = Number(summary.bossesDefeated) || 0
  const checkpointsCount = Number(summary.checkpointsCount) || 0
  const diaryEntriesCount = Number(summary.diaryEntriesCount) || 0

  const summaryCards = [
    {
      id: 'lifetime-xp',
      label: 'LIFETIME EXPERIENCE',
      value: `${totalXp.toLocaleString()} XP`,
      detail: 'Cumulative experience accumulated across all quests and bosses',
      icon: Zap,
      tone: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20',
      link: '/analytics',
    },
    {
      id: 'achievements',
      label: 'HONORS CLAIMED',
      value: `${achievementsUnlocked} / ${totalAchievements}`,
      detail: 'Codex achievements unlocked and inscribed',
      icon: Trophy,
      tone: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
      link: '/achievements',
    },
    {
      id: 'bosses',
      label: 'BOSSES VANQUISHED',
      value: `${bossesDefeated}`,
      detail: 'Weekly raid bosses defeated in combat',
      icon: Skull,
      tone: 'text-rose-300 bg-rose-400/10 border-rose-400/20',
      link: '/boss',
    },
    {
      id: 'checkpoints',
      label: 'TRANSFORMATION PHOTOS',
      value: `${checkpointsCount}`,
      detail: 'Private visual checkpoints logged to timeline',
      icon: Camera,
      tone: 'text-violet-300 bg-violet-400/10 border-violet-400/20',
      link: '/progress',
    },
    {
      id: 'diary',
      label: 'DIARY REFLECTIONS',
      value: `${diaryEntriesCount}`,
      detail: 'Daily cognitive logs and reflection notes recorded',
      icon: BookOpen,
      tone: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
      link: '/diary',
    },
  ]

  return (
    <Card variant="glass" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-amber-300/30 bg-amber-400/10 text-amber-200">
            <Award size={17} />
          </span>
          <div>
            <p className="label-caps text-amber-300/80">MILESTONE TALLIES</p>
            <h2 className="font-display text-base font-semibold text-white">
              PROGRESS SUMMARY
            </h2>
          </div>
        </div>

        <span className="font-mono text-xs text-slate-500">
          Lifetime Codex
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {summaryCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={card.link}
                className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${card.tone}`}
                    >
                      <Icon size={17} />
                    </span>
                    <span className="text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-200">
                      <ChevronRight size={15} />
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="label-caps text-[0.62rem] text-slate-500">
                      {card.label}
                    </p>
                    <p className="font-mono text-xl font-bold tracking-tight text-white">
                      {card.value}
                    </p>
                    <p className="mt-1 text-[0.7rem] leading-relaxed text-slate-400">
                      {card.detail}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/5 pt-2 text-[0.68rem] font-mono text-cyan-300/70 group-hover:text-cyan-200">
                  Inspect Module →
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}

export default PlayerProgressSummary
