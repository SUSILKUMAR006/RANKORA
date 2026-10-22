import { motion } from 'framer-motion'
import { Award, CheckCircle2, Lock, Search, Sparkles, Trophy, Zap } from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'

const SEGMENTS = 20

const tabActive = 'border-system-400 bg-system-500/15 text-frost-50 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
const tabIdle = 'border-edge text-frost-400 hover:border-edge-strong hover:text-frost-100'

function AchievementOverview({
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
}) {
  const lockedCount = totalCount - unlockedCount
  const filledSegments = Math.round((Math.min(100, Math.max(0, Number(completionPercentage) || 0)) / 100) * SEGMENTS)

  return (
    <div className="space-y-6">
      {/* Codex status window */}
      <SystemWindow
        title="Codex status"
        tone="shadow"
        icon={<Trophy size={13} />}
        bodyClassName="p-0"
        actions={
          <span className="font-mono text-sm text-frost-200">
            [<span className="text-shadow-200">{unlockedCount}</span>/{totalCount}]
          </span>
        }
      >
        {/* Segmented completion gauge */}
        <div className="px-5 pb-5 pt-4">
          <div className="mb-2.5 flex items-end justify-between gap-3">
            <p className="label-caps text-shadow-300">Completion</p>
            <p className="font-display text-4xl font-bold leading-none text-frost-50 sys-glow">
              {completionPercentage}
              <span className="text-xl text-shadow-300">%</span>
            </p>
          </div>
          <div
            className="flex gap-0.5 sm:gap-1"
            role="progressbar"
            aria-label="Achievement completion"
            aria-valuenow={completionPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {Array.from({ length: SEGMENTS }, (_, i) => {
              const filled = i < filledSegments
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scaleY: 0.3 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: i * 0.015, duration: 0.2 }}
                  className={`h-3 flex-1 border ${
                    filled
                      ? 'border-shadow-300 bg-shadow-400 shadow-[0_0_8px_rgba(155,107,255,0.75)]'
                      : 'border-edge bg-void-950'
                  }`}
                />
              )
            })}
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid gap-2.5 border-t border-(--panel-edge,var(--color-edge)) p-5 sm:grid-cols-3">
          {/* Unlocked */}
          <div className="sys-inset px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="label-caps text-frost-500">Total unlocked</p>
              <Trophy size={15} className="text-shadow-300" />
            </div>
            <p className="mt-1.5 font-display text-3xl font-bold leading-none text-frost-50">
              {unlockedCount} <span className="font-mono text-sm font-normal text-frost-500">/ {totalCount}</span>
            </p>
            <p className="mt-1.5 font-mono text-xs text-shadow-200">{completionPercentage}% complete</p>
          </div>

          {/* Achievement points */}
          <div className="sys-inset px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="label-caps text-frost-500">Achievement points</p>
              <Zap size={15} className="text-gold-400" />
            </div>
            <p className="mt-1.5 font-display text-3xl font-bold leading-none text-gold-300">
              {totalPoints.toLocaleString()}{' '}
              <span className="font-mono text-sm font-normal text-frost-500">/ {maxPoints.toLocaleString()} AP</span>
            </p>
            <p className="mt-1.5 font-mono text-xs text-frost-500">Earned from unlocked honors</p>
          </div>

          {/* Status breakdown */}
          <div className="sys-inset px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="label-caps text-frost-500">Breakdown</p>
              <Award size={15} className="text-shadow-300" />
            </div>
            <div className="mt-1.5 grid grid-cols-3 divide-x divide-edge/70 text-center">
              <div>
                <p className="font-display text-2xl font-bold leading-none text-clear-300">{unlockedCount}</p>
                <p className="label-caps mt-1 text-[0.65rem] text-frost-500">Claimed</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold leading-none text-frost-400">{lockedCount}</p>
                <p className="label-caps mt-1 text-[0.65rem] text-frost-500">Remaining</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold leading-none text-frost-50">{totalCount}</p>
                <p className="label-caps mt-1 text-[0.65rem] text-frost-500">Total</p>
              </div>
            </div>
          </div>
        </div>

        <p className="border-t border-(--panel-edge,var(--color-edge)) px-5 py-2.5 text-right font-mono text-[0.65rem] uppercase tracking-[0.14em] text-frost-600">
          Verified in MongoDB Cloud
        </p>
      </SystemWindow>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'ALL', count: totalCount, icon: Sparkles },
            { id: 'unlocked', label: 'UNLOCKED', count: unlockedCount, icon: CheckCircle2 },
            { id: 'locked', label: 'IN PROGRESS', count: lockedCount, icon: Lock },
          ].map(({ id, label, count, icon: TabIcon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveFilter(id)}
              className={`flex items-center gap-2 rounded-xs border px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] transition-[border-color,background-color,color,box-shadow] ${
                activeFilter === id ? tabActive : tabIdle
              }`}
            >
              <TabIcon size={14} className={activeFilter === id ? 'text-system-300' : 'text-frost-500'} />
              <span>{label}</span>
              <span
                className={`border px-1.5 font-mono text-[0.65rem] ${
                  activeFilter === id ? 'border-system-400/60 text-system-200' : 'border-edge text-frost-500'
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input & Category Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-frost-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search achievements..."
              className="field pl-9"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-xs border px-2.5 py-1.5 font-display text-xs font-bold uppercase tracking-[0.14em] transition-[border-color,background-color,color,box-shadow] ${
                  activeCategory === cat
                    ? 'border-shadow-400 bg-shadow-500/15 text-shadow-100 shadow-[0_0_12px_-2px_rgba(155,107,255,0.6)]'
                    : tabIdle
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementOverview
