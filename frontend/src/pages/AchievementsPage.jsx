import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import AchievementCard from '../components/achievements/AchievementCard.jsx'
import AchievementOverview from '../components/achievements/AchievementOverview.jsx'
import AchievementUnlockModal from '../components/achievements/AchievementUnlockModal.jsx'
import { PageHeader } from '../components/common/SectionHeader.jsx'
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
      <PageHeader
        eyebrow="Player codex / Reputation"
        title={
          <>
            <span className="text-shadow-400">[</span> Titles Acquired <span className="text-shadow-400">]</span>
          </>
        }
        description="Track your milestones, streaks, quest history, and progression records. Honors are permanently verified and synchronized across your account in MongoDB."
        actions={
          <div className="sys-inset flex items-center gap-2 px-3 py-2 font-mono text-sm text-frost-300">
            <Sparkles size={14} className="text-shadow-300" />
            <span>
              [<span className="text-shadow-200">{unlockedCount}</span>/{totalCount}] completed
            </span>
          </div>
        }
      />

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
            title="No achievements found"
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
        className="label-caps flex items-center justify-center gap-2 text-center text-frost-600"
      >
        <span className="h-1.5 w-1.5 animate-sys-pulse bg-clear-400 shadow-[0_0_6px_rgba(52,217,156,0.8)]" />
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
