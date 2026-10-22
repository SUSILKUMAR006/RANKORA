import { motion } from 'framer-motion'
import { Award, BookOpen, Camera, ChevronRight, Skull, Trophy, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import SystemWindow from '../common/SystemWindow.jsx'

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
      tone: 'border-gold-400/50 bg-gold-500/10 text-gold-300',
      valueTone: 'text-gold-300',
      link: '/analytics',
    },
    {
      id: 'achievements',
      label: 'HONORS CLAIMED',
      value: `${achievementsUnlocked} / ${totalAchievements}`,
      detail: 'Codex achievements unlocked and inscribed',
      icon: Trophy,
      tone: 'border-shadow-400/50 bg-shadow-500/10 text-shadow-300',
      valueTone: 'text-shadow-200',
      link: '/achievements',
    },
    {
      id: 'bosses',
      label: 'BOSSES VANQUISHED',
      value: `${bossesDefeated}`,
      detail: 'Weekly raid bosses defeated in combat',
      icon: Skull,
      tone: 'border-penalty-400/50 bg-penalty-500/10 text-penalty-300',
      valueTone: 'text-penalty-200',
      link: '/boss',
    },
    {
      id: 'checkpoints',
      label: 'TRANSFORMATION PHOTOS',
      value: `${checkpointsCount}`,
      detail: 'Private visual checkpoints logged to timeline',
      icon: Camera,
      tone: 'border-system-400/50 bg-system-500/10 text-system-200',
      valueTone: 'text-frost-50',
      link: '/progress',
    },
    {
      id: 'diary',
      label: 'DIARY REFLECTIONS',
      value: `${diaryEntriesCount}`,
      detail: 'Daily cognitive logs and reflection notes recorded',
      icon: BookOpen,
      tone: 'border-clear-400/50 bg-clear-500/10 text-clear-300',
      valueTone: 'text-frost-50',
      link: '/diary',
    },
  ]

  return (
    <SystemWindow
      title="Progress Summary"
      icon={<Award size={13} />}
      bodyClassName="p-0"
      actions={<span className="label-caps hidden text-frost-500 sm:inline">Lifetime codex</span>}
    >
      <p className="label-caps border-b border-edge/70 px-5 py-3 text-frost-500">Milestone tallies</p>

      <div className="divide-y divide-edge/60">
        {summaryCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={card.link}
                aria-label={`${card.label}: inspect module`}
                className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-system-500/5"
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center border ${card.tone}`}>
                  <Icon size={16} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="label-caps text-frost-300 transition-colors group-hover:text-system-200">{card.label}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-frost-500 sm:line-clamp-1">{card.detail}</p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className={`font-display text-xl font-bold sm:text-2xl ${card.valueTone}`}>{card.value}</span>
                  <span className="hidden items-center gap-1 font-mono text-[0.68rem] text-system-300/70 transition-colors group-hover:text-system-200 md:inline-flex xl:hidden 2xl:inline-flex">
                    Inspect module
                  </span>
                  <ChevronRight
                    size={15}
                    className="text-frost-600 transition-transform group-hover:translate-x-0.5 group-hover:text-system-200"
                  />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </SystemWindow>
  )
}

export default PlayerProgressSummary
