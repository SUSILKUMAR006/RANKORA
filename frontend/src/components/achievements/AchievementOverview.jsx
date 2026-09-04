import { motion } from 'framer-motion'
import { Award, CheckCircle2, Lock, Search, Sparkles, Trophy, Zap } from 'lucide-react'
import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'

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

  return (
    <div className="space-y-6">
      {/* Top Header & Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Unlocked Progress Card */}
        <Card variant="highlighted" className="relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />
          <div className="flex items-center justify-between">
            <p className="label-caps text-cyan-300/80">TOTAL UNLOCKED</p>
            <Trophy size={18} className="text-cyan-300" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-white">
              {unlockedCount}
            </span>
            <span className="font-mono text-sm text-slate-500">/ {totalCount}</span>
            <span className="ml-auto font-mono text-sm font-semibold text-cyan-200">
              {completionPercentage}%
            </span>
          </div>
          <ProgressBar
            value={completionPercentage}
            max={100}
            tone="xp"
            className="mt-3"
          />
        </Card>

        {/* Achievement Points Card */}
        <Card variant="glass" className="relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-400/10 blur-2xl" />
          <div className="flex items-center justify-between">
            <p className="label-caps text-amber-200/80">ACHIEVEMENT POINTS</p>
            <Zap size={18} className="text-amber-300" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-amber-200">
              {totalPoints.toLocaleString()}
            </span>
            <span className="font-mono text-sm text-slate-500">
              / {maxPoints.toLocaleString()} AP
            </span>
          </div>
          <p className="mt-3 font-mono text-xs text-slate-500">
            Earned from unlocked honors
          </p>
        </Card>

        {/* Status Breakdown Card */}
        <Card variant="glass">
          <div className="flex items-center justify-between">
            <p className="label-caps text-slate-400">CODEX STATUS</p>
            <Award size={18} className="text-violet-300" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-2xl font-semibold text-emerald-300">
                {unlockedCount}
              </p>
              <p className="text-[0.68rem] font-medium text-slate-500 uppercase tracking-wider">
                Claimed
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="font-mono text-2xl font-semibold text-slate-400">
                {lockedCount}
              </p>
              <p className="text-[0.68rem] font-medium text-slate-500 uppercase tracking-wider">
                Remaining
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="font-mono text-2xl font-semibold text-cyan-200">
                {totalCount}
              </p>
              <p className="text-[0.68rem] font-medium text-slate-500 uppercase tracking-wider">
                Total
              </p>
            </div>
          </div>
          <p className="mt-2 text-right font-mono text-[0.65rem] text-cyan-300/70">
            Verified in MongoDB Cloud
          </p>
        </Card>
      </div>

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
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition ${
                activeFilter === id
                  ? 'border-cyan-300/60 bg-cyan-300/12 text-cyan-100 shadow-[0_0_20px_rgba(103,232,249,0.12)]'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <TabIcon size={14} className={activeFilter === id ? 'text-cyan-300' : 'text-slate-500'} />
              <span>{label}</span>
              <span
                className={`rounded-md px-1.5 py-0.2 text-[0.65rem] ${
                  activeFilter === id
                    ? 'bg-cyan-300/20 text-cyan-200'
                    : 'bg-white/5 text-slate-500'
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
          <div className="relative min-w-48 flex-1 sm:w-64 sm:flex-initial">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search achievements..."
              className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-300/50 focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(103,232,249,0.1)]"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg border px-2.5 py-1.5 font-mono text-[0.68rem] tracking-wider transition ${
                  activeCategory === cat
                    ? 'border-violet-400/40 bg-violet-400/15 text-violet-200 shadow-[0_0_14px_rgba(167,139,250,0.15)]'
                    : 'border-white/5 bg-white/[0.02] text-slate-500 hover:border-white/15 hover:text-slate-300'
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
