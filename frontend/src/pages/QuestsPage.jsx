import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Dumbbell,
  Eye,
  Flame,
  HeartPulse,
  Plus,
  RotateCcw,
  Search,
  Shield,
  Sparkles,
  Swords,
  XCircle,
  Zap,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import QuestFailureModal from '../components/quests/QuestFailureModal.jsx'
import QuestVerificationModal from '../components/quests/QuestVerificationModal.jsx'
import XPRewardAnimation from '../components/quests/XPRewardAnimation.jsx'
import DailyWorkoutCard from '../components/workout/DailyWorkoutCard.jsx'
import { completeQuest, getStoredQuests, restoreDefaultQuests } from '../hooks/useQuestCompletion.js'
import { questService } from '../services/questService.js'
import { getQuestIcon } from '../data/mockQuests.js'
import { isToday } from '../utils/failureUtils.js'

const categories = ['All', 'Fitness', 'Knowledge', 'Health', 'Mind', 'Habit']

const categoryIcons = {
  Fitness: Dumbbell,
  Knowledge: BookOpen,
  Health: HeartPulse,
  Mind: Brain,
  Habit: Flame,
}

function QuestsPage() {
  const navigate = useNavigate()
  const [quests, setQuests] = useState(() => getStoredQuests())
  const [statusFilter, setStatusFilter] = useState('All') // 'All' | 'pending' | 'completed' | 'failed'
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [search, setSearch] = useState('')

  // Modal States
  const [verificationQuest, setVerificationQuest] = useState(null)
  const [failureQuest, setFailureQuest] = useState(null)
  const [xpAnimation, setXpAnimation] = useState(null)

  const refreshQuests = () => {
    setQuests(getStoredQuests())
  }

  useEffect(() => {
    window.addEventListener('storage', refreshQuests)
    window.addEventListener('rankora-player-updated', refreshQuests)
    window.addEventListener('rankora-workout-updated', refreshQuests)
    return () => {
      window.removeEventListener('storage', refreshQuests)
      window.removeEventListener('rankora-player-updated', refreshQuests)
      window.removeEventListener('rankora-workout-updated', refreshQuests)
    }
  }, [])

  const handleExecute = (quest) => {
    if (quest.status === 'completed') return

    // Check if verification required
    if (quest.verification && String(quest.verification).toLowerCase() !== 'none') {
      setVerificationQuest(quest)
      return
    }

    // Direct Complete
    const result = completeQuest(quest.id)
    if (result && !result.error) {
      setXpAnimation({ xp: result.gainedXp || quest.xp, title: quest.title })
      refreshQuests()
      setTimeout(() => setXpAnimation(null), 2500)
    }
  }

  const handleVerificationSuccess = (payload) => {
    if (verificationQuest) {
      const targetId = verificationQuest.id || verificationQuest._id
      const result = completeQuest(targetId, { bypassVerification: true, proof: payload })
      questService.verifyQuest(targetId, payload).catch(() => {})
      if (result && !result.error) {
        setXpAnimation({ xp: result.gainedXp || verificationQuest.xp, title: verificationQuest.title })
        setTimeout(() => setXpAnimation(null), 2500)
      }
    }
    refreshQuests()
  }

  const handleFailureRecorded = () => {
    setFailureQuest(null)
    refreshQuests()
  }

  const handleRestoreDefaults = () => {
    const restored = restoreDefaultQuests()
    setQuests(restored)
  }

  const completedCount = quests.filter((q) => q.status === 'completed').length
  const pendingCount = quests.filter((q) => q.status !== 'completed' && q.status !== 'failed').length
  const failedCount = quests.filter((q) => q.status === 'failed' && isToday(q.failedAt)).length
  const xpAvailable = quests
    .filter((q) => q.status !== 'completed')
    .reduce((sum, q) => sum + (Number(q.xp) || 0), 0)

  const filteredQuests = quests.filter((quest) => {
    // Status Filter
    if (statusFilter === 'pending' && quest.status === 'completed') return false
    if (statusFilter === 'pending' && quest.status === 'failed' && isToday(quest.failedAt)) return false
    if (statusFilter === 'completed' && quest.status !== 'completed') return false
    if (statusFilter === 'failed' && (quest.status !== 'failed' || !isToday(quest.failedAt))) return false

    // Category Filter
    if (categoryFilter !== 'All' && quest.category !== categoryFilter) return false

    // Search Query
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchesTitle = quest.title?.toLowerCase().includes(q)
      const matchesDesc = quest.description?.toLowerCase().includes(q)
      if (!matchesTitle && !matchesDesc) return false
    }

    return true
  })

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
              <Swords size={14} />
            </span>
            <p className="label-caps text-cyan-300/80">DAILY DISCIPLINE PROTOCOL</p>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            DAILY QUESTS
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Execute mission objectives to earn XP, strengthen core RPG attributes,
            maintain streaks, and deal direct damage to the weekly raid boss.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={handleRestoreDefaults}
            className="border border-white/10 hover:border-cyan-300/30 text-xs text-slate-300 hover:text-white"
            title="Restore all default routine quests"
          >
            <RotateCcw size={14} /> RESTORE DEFAULTS
          </Button>
          <Link to="/quests/create">
            <Button variant="primary">
              <Plus size={16} /> CREATE QUEST
            </Button>
          </Link>
        </div>
      </motion.header>

      {/* Sunday Rest Day Banner */}
      {new Date().getDay() === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3.5 rounded-2xl border border-emerald-400/30 bg-emerald-950/20 p-4 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.1)]"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-wider text-emerald-300">
              SUNDAY REST & RECOVERY PROTOCOL ACTIVE
            </p>
            <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">
              Scheduled neural and physical recovery day. Gym training is optional today to support tissue repair.
            </p>
          </div>
        </motion.div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="highlighted" className="p-4">
          <p className="label-caps text-cyan-300/80">TOTAL MISSIONS</p>
          <p className="mt-1 font-mono text-2xl font-bold text-white">{quests.length}</p>
          <p className="mt-0.5 text-[0.68rem] text-slate-400">Active roster</p>
        </Card>

        <Card variant="glass" className="p-4">
          <p className="label-caps text-emerald-300/80">COMPLETED TODAY</p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-300">{completedCount}</p>
          <p className="mt-0.5 text-[0.68rem] text-slate-400">Objectives verified</p>
        </Card>

        <Card variant="glass" className="p-4">
          <p className="label-caps text-amber-300/80">PENDING OBJECTIVES</p>
          <p className="mt-1 font-mono text-2xl font-bold text-amber-300">{pendingCount}</p>
          <p className="mt-0.5 text-[0.68rem] text-slate-400">Awaiting execution</p>
        </Card>

        <Card variant="glass" className="p-4">
          <p className="label-caps text-violet-300/80">REMAINING XP YIELD</p>
          <p className="mt-1 font-mono text-2xl font-bold text-violet-300">+{xpAvailable} XP</p>
          <p className="mt-0.5 text-[0.68rem] text-slate-400">Available to claim</p>
        </Card>
      </div>

      {/* Daily Workout Plan & Interactive Exercise Tracker */}
      <section>
        <DailyWorkoutCard onQuestCompleted={refreshQuests} />
      </section>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1 text-xs">
            {[
              { id: 'All', label: 'All', count: quests.length },
              { id: 'pending', label: 'Pending', count: pendingCount },
              { id: 'completed', label: 'Completed', count: completedCount },
              { id: 'failed', label: 'Failed', count: failedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition ${
                  statusFilter === tab.id
                    ? 'border border-cyan-300/40 bg-cyan-400/15 text-cyan-100 shadow-[0_0_12px_rgba(103,232,249,0.15)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search daily quests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-4 font-mono text-xs text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-300/50 focus:bg-white/[0.06]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1 font-mono text-xs transition ${
                categoryFilter === cat
                  ? 'border border-white/20 bg-white/10 text-white font-semibold shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                  : 'border border-white/5 bg-white/[0.02] text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quest Cards Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredQuests.map((quest, index) => {
            const isCompleted = quest.status === 'completed'
            const isFailed = quest.status === 'failed' && isToday(quest.failedAt)
            const Icon = getQuestIcon(quest) || categoryIcons[quest.category] || Swords

            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card
                  variant={isCompleted ? 'highlighted' : 'glass'}
                  className={`flex h-full flex-col justify-between p-5 transition ${
                    isCompleted
                      ? 'border-emerald-400/30 bg-emerald-950/10'
                      : isFailed
                      ? 'border-rose-400/30 bg-rose-950/10'
                      : 'hover:border-white/20'
                  }`}
                >
                  <div>
                    {/* Card Top: Badges & Rewards */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-400/10 text-cyan-200">
                          <Icon size={16} />
                        </span>
                        <div>
                          <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[0.62rem] text-slate-400 uppercase">
                            {quest.category}
                          </span>
                          <span className="ml-1.5 font-mono text-[0.62rem] text-slate-500">
                            · {quest.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="rounded-md border border-cyan-300/30 bg-cyan-400/10 px-2 py-0.5 font-bold text-cyan-200">
                          +{quest.xp} XP
                        </span>
                        {quest.statReward && quest.statReward !== 'NONE' && (
                          <span className="rounded-md border border-violet-300/30 bg-violet-400/10 px-2 py-0.5 font-bold text-violet-200">
                            {quest.statReward}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quest Title & Description */}
                    <div className="mt-4">
                      <Link to={`/quests/${quest.id}`} className="group">
                        <h3 className="font-display text-base font-semibold text-white group-hover:text-cyan-200 transition">
                          {quest.title}
                        </h3>
                      </Link>
                      <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {quest.description || quest.shortDescription}
                      </p>
                    </div>

                    {/* Meta info: Time & Verification */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[0.68rem] text-slate-500 border-t border-white/5 pt-3">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {quest.estimatedTime || '30 Mins'}
                      </span>
                      {quest.verification && String(quest.verification).toLowerCase() !== 'none' && (
                        <span className="flex items-center gap-1 text-violet-300">
                          <Sparkles size={11} /> Proof Required
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/5 pt-4">
                    <Link
                      to={`/quests/${quest.id}`}
                      className="inline-flex items-center gap-1 font-mono text-xs text-slate-400 hover:text-cyan-200 transition"
                    >
                      <Eye size={14} /> Details
                    </Link>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 font-mono text-xs font-semibold text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
                        <Check size={14} /> COMPLETED
                      </span>
                    ) : isFailed ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/40 bg-rose-400/15 px-3 py-1 font-mono text-xs font-semibold text-rose-300">
                        <XCircle size={14} /> FAILED
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFailureQuest(quest)}
                          className="rounded-lg border border-rose-400/20 bg-rose-400/5 px-2.5 py-1 font-mono text-xs text-rose-300 hover:bg-rose-400/15 transition"
                        >
                          FAIL
                        </button>
                        <Button
                          type="button"
                          variant="primary"
                          className="text-xs px-3.5 py-1"
                          onClick={() => handleExecute(quest)}
                        >
                          <Check size={14} /> COMPLETE
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <Card variant="glass" className="py-12 text-center text-slate-500 font-mono text-xs">
          No quests match current filter. Click "CREATE QUEST" to add a custom objective.
        </Card>
      )}

      {/* Verification Modal */}
      {verificationQuest && (
        <QuestVerificationModal
          open={Boolean(verificationQuest)}
          quest={verificationQuest}
          onClose={() => {
            setVerificationQuest(null)
            refreshQuests()
          }}
          onVerified={handleVerificationSuccess}
          onSubmitted={handleVerificationSuccess}
        />
      )}

      {/* Failure Modal */}
      {failureQuest && (
        <QuestFailureModal
          open={Boolean(failureQuest)}
          quest={failureQuest}
          onClose={() => setFailureQuest(null)}
          onRecorded={handleFailureRecorded}
        />
      )}

      {/* XP Reward Animation Popup */}
      {xpAnimation && (
        <XPRewardAnimation
          xp={xpAnimation.xp}
          title={xpAnimation.title}
          onComplete={() => setXpAnimation(null)}
        />
      )}
    </div>
  )
}

export default QuestsPage
