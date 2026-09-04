import { motion } from 'framer-motion'
import { Sparkles, Trophy } from 'lucide-react'
import AchievementCard from '../components/achievements/AchievementCard.jsx'
import AchievementOverview from '../components/achievements/AchievementOverview.jsx'
import AchievementUnlockModal from '../components/achievements/AchievementUnlockModal.jsx'
import { EmptyState } from '../components/common/States.jsx'
import { useAchievements } from '../hooks/useAchievements.js'

function AchievementsPage() {
  const {
    achievements,
    unlockedCount,
    totalCount,
    completionPercentage,
    totalPoints,
    maxPoints,
    activeFilter,
    setActiveFilter,
    activeCategory,
    setActiveCategory,
    categories,
    searchQuery,
    setSearchQuery,
    currentModalAchievement,
    dismissModal,
  } = useAchievements()

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
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-amber-400/10 text-amber-300">
              <Trophy size={14} />
            </span>
            <p className="label-caps text-amber-300/80">PLAYER CODEX / REPUTATION</p>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ACHIEVEMENTS
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Track your milestones, streaks, quest history, and progression records.
            Honors are permanently verified and synchronized across your account in MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-xs text-slate-400">
          <Sparkles size={14} className="text-cyan-300" />
          <span>{unlockedCount} / {totalCount} Completed</span>
        </div>
      </motion.header>

      {/* Overview & Filter Bar */}
      <AchievementOverview
        unlockedCount={unlockedCount}
        totalCount={totalCount}
        completionPercentage={completionPercentage}
        totalPoints={totalPoints}
        maxPoints={maxPoints}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Achievement Cards Grid */}
      {achievements.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      ) : (
        <div className="py-12">
          <EmptyState
            title="NO ACHIEVEMENTS FOUND"
            description={
              searchQuery
                ? `No achievements matching "${searchQuery}". Try clearing your search query.`
                : 'No achievements match the current filter selection.'
            }
          />
        </div>
      )}

      {/* System Status Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-700"
      >
        Rankora Codex · Live Evaluator Active · Auto-synced to storage
      </motion.p>

      {/* Unlock Celebration Modal */}
      <AchievementUnlockModal
        achievement={currentModalAchievement}
        onClose={dismissModal}
      />
    </div>
  )
}

export default AchievementsPage
