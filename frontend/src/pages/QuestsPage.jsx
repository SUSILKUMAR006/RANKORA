import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Camera,
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
  X,
  XCircle,
  Zap,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import { PageHeader } from '../components/common/SectionHeader.jsx'
import { EmptyState } from '../components/common/States.jsx'
import SystemWindow from '../components/common/SystemWindow.jsx'
import QuestFailureModal from '../components/quests/QuestFailureModal.jsx'
import QuestVerificationModal from '../components/quests/QuestVerificationModal.jsx'
import XPRewardAnimation from '../components/quests/XPRewardAnimation.jsx'
import DailyWorkoutCard from '../components/workout/DailyWorkoutCard.jsx'
import { getStoredQuests, restoreDefaultQuests } from '../hooks/useQuestCompletion.js'
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
  const [failureProcessing, setFailureProcessing] = useState(false)
  const [failureRecorded, setFailureRecorded] = useState(false)
  const [xpAnimation, setXpAnimation] = useState(null)
  const [syncError, setSyncError] = useState('')

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

  const handleExecute = async (quest) => {
    if (quest.status === 'completed') return

    // Check if verification required
    if (quest.verification && String(quest.verification).toLowerCase() !== 'none') {
      setVerificationQuest(quest)
      return
    }

    setSyncError('')
    try {
      // Database is authoritative: wait for the write to succeed before
      // updating the local mirror / showing the reward animation.
      const result = await questService.completeQuest(quest.id)
      if (result && !result.error) {
        setXpAnimation({ xp: result.gainedXp || quest.xp, title: quest.title })
        refreshQuests()
        setTimeout(() => setXpAnimation(null), 2500)
      }
    } catch (error) {
      setSyncError(error?.message || 'Failed to save quest completion. Check your connection and try again.')
    }
  }

  const handleVerificationSuccess = async (payload) => {
    if (verificationQuest) {
      const targetId = verificationQuest.id || verificationQuest._id
      setSyncError('')
      try {
        const result = await questService.verifyQuest(targetId, payload)
        if (result && !result.error) {
          setXpAnimation({ xp: result.gainedXp || verificationQuest.xp, title: verificationQuest.title })
          setTimeout(() => setXpAnimation(null), 2500)
        }
      } catch (error) {
        setSyncError(error?.message || 'Failed to save quest completion. Check your connection and try again.')
      }
    }
    refreshQuests()
  }

  const handleConfirmFailure = async (payload) => {
    if (!failureQuest) return
    setFailureProcessing(true)
    setSyncError('')
    try {
      await questService.failQuest(failureQuest.id || failureQuest._id, payload)
      setFailureProcessing(false)
      setFailureRecorded(true)
      refreshQuests()
      setTimeout(() => {
        setFailureQuest(null)
        setFailureRecorded(false)
      }, 1500)
    } catch (error) {
      setFailureProcessing(false)
      setSyncError(error?.message || 'Failed to record quest failure. Check your connection and try again.')
    }
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


  const statusTabs = [
    { id: 'All', label: 'All', count: quests.length },
    { id: 'pending', label: 'Pending', count: pendingCount },
    { id: 'completed', label: 'Completed', count: completedCount },
    { id: 'failed', label: 'Failed', count: failedCount },
  ]

  const tabClass = (active) =>
    `inline-flex min-h-9 items-center gap-1.5 rounded-xs border px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.14em] transition-[background-color,border-color,box-shadow,color] duration-150 ${
      active
        ? 'border-system-400 bg-system-500/15 text-frost-50 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
        : 'border-edge text-frost-400 hover:border-edge-strong hover:text-frost-100'
    }`

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <PageHeader
        eyebrow="Daily Discipline Protocol"
        title="Daily Quests"
        description="Execute mission objectives to earn XP, strengthen core RPG attributes, maintain streaks, and deal direct damage to the weekly raid boss."
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={handleRestoreDefaults}
              className="text-xs"
              title="Restore all default routine quests"
            >
              <RotateCcw size={14} /> RESTORE DEFAULTS
            </Button>
            <Link to="/quests/create">
              <Button variant="primary">
                <Plus size={16} /> CREATE QUEST
              </Button>
            </Link>
          </>
        }
      />

      {/* Sync Error Banner */}
      {syncError && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="sys-panel tone-penalty flex items-start gap-3 px-4 py-3.5"
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-penalty-400" />
          <p className="text-xs leading-relaxed text-penalty-200">
            <span className="font-display font-bold uppercase tracking-[0.14em] text-penalty-300">Warning:</span> {syncError}
          </p>
        </motion.div>
      )}

      {/* Sunday Rest Day Banner */}
      {new Date().getDay() === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="sys-panel tone-clear flex items-center gap-3.5 px-4 py-4"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center border border-clear-400/60 bg-clear-500/10 text-clear-300 shadow-[0_0_12px_-2px_rgba(52,217,156,0.45)]">
            <Sparkles size={18} />
          </span>
          <div className="min-w-0">
            <p className="label-caps text-clear-300">Sunday rest &amp; recovery protocol active</p>
            <p className="mt-1 text-xs leading-relaxed text-frost-300">
              Scheduled neural and physical recovery day. Gym training is optional today to support tissue repair.
            </p>
          </div>
        </motion.div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card variant="highlighted" className="p-4">
          <p className="label-caps text-system-300">Total missions</p>
          <p className="mt-1 font-display text-3xl font-bold leading-none text-frost-50 sys-glow">{quests.length}</p>
          <p className="mt-1.5 text-[0.68rem] text-frost-500">Active roster</p>
        </Card>

        <Card variant="standard" tone="clear" className="p-4">
          <p className="label-caps text-clear-300">Completed today</p>
          <p className="mt-1 font-display text-3xl font-bold leading-none text-clear-300">{completedCount}</p>
          <p className="mt-1.5 text-[0.68rem] text-frost-500">Objectives verified</p>
        </Card>

        <Card variant="standard" className="p-4">
          <p className="label-caps text-frost-400">Pending objectives</p>
          <p className="mt-1 font-display text-3xl font-bold leading-none text-frost-50">{pendingCount}</p>
          <p className="mt-1.5 text-[0.68rem] text-frost-500">Awaiting execution</p>
        </Card>

        <Card variant="standard" tone="gold" className="p-4">
          <p className="label-caps text-gold-300">Remaining EXP yield</p>
          <p className="mt-1 font-mono text-2xl font-bold leading-tight text-gold-300 sys-glow">+{xpAvailable}</p>
          <p className="mt-1 text-[0.68rem] text-frost-500">XP available to claim</p>
        </Card>
      </div>

      {/* Daily Workout Plan & Interactive Exercise Tracker */}
      <section>
        <DailyWorkoutCard onQuestCompleted={refreshQuests} />
      </section>

      {/* Filter and Search Controls */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5" aria-label="Filter by status">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                aria-pressed={statusFilter === tab.id}
                className={tabClass(statusFilter === tab.id)}
              >
                {tab.label}
                <span className={`font-mono text-[0.7rem] ${statusFilter === tab.id ? 'text-system-200' : 'text-frost-600'}`}>
                  [{tab.count}]
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-frost-500" />
            <input
              type="text"
              placeholder="Search daily quests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field h-10 pl-9! font-mono text-xs!"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5" aria-label="Filter by category">
          <span className="label-caps mr-1 text-frost-600">Category</span>
          {categories.map((cat) => {
            const CategoryIcon = categoryIcons[cat]
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                aria-pressed={categoryFilter === cat}
                className={`${tabClass(categoryFilter === cat)} min-h-8 px-2.5 py-1`}
              >
                {CategoryIcon && <CategoryIcon size={12} />}
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Quest Board */}
      <SystemWindow
        title="Daily Quest"
        icon={<span className="font-display text-sm font-bold">!</span>}
        bodyClassName="p-0"
        actions={
          <span className="font-mono text-xs text-frost-400">
            <span className="hidden sm:inline">Showing </span>
            {filteredQuests.length}
          </span>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge/70 px-4 py-3 sm:px-5">
          <p className="label-caps text-frost-400">Goals</p>
          <p className="font-mono text-sm text-frost-200">
            [<span className="text-clear-300">{completedCount}</span>/{quests.length}] cleared
          </p>
        </div>

        {filteredQuests.length > 0 ? (
          <div className="divide-y divide-edge/60">
            {filteredQuests.map((quest, index) => {
              const isCompleted = quest.status === 'completed'
              const isFailed = quest.status === 'failed' && isToday(quest.failedAt)
              const Icon = getQuestIcon(quest) || categoryIcons[quest.category] || Swords
              const needsProof = quest.verification && String(quest.verification).toLowerCase() !== 'none'

              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`flex flex-col gap-3 px-4 py-4 transition-colors sm:flex-row sm:items-center sm:gap-5 sm:px-5 ${
                    isCompleted ? 'bg-clear-500/3' : isFailed ? 'bg-penalty-500/5' : 'hover:bg-system-500/5'
                  }`}
                >
                  {/* Status square + quest info */}
                  <div className="flex min-w-0 flex-1 gap-3.5">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center border ${
                        isCompleted
                          ? 'border-clear-400/70 bg-clear-500/10 text-clear-300 shadow-[0_0_10px_rgba(52,217,156,0.35)]'
                          : isFailed
                          ? 'border-penalty-400/70 bg-penalty-500/10 text-penalty-300'
                          : 'border-edge-strong bg-void-950 text-system-300'
                      }`}
                    >
                      {isCompleted ? <Check size={17} /> : isFailed ? <X size={17} /> : <Icon size={17} />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <Link to={`/quests/${quest.id}`} className="group min-w-0">
                          <h3
                            className={`font-display text-base font-bold uppercase tracking-[0.08em] transition-colors group-hover:text-system-200 ${
                              isCompleted || isFailed ? 'text-frost-500' : 'text-frost-50'
                            } ${isCompleted ? 'line-through decoration-clear-400/60' : ''}`}
                          >
                            {quest.title}
                          </h3>
                        </Link>
                        <span className="label-caps text-frost-600">
                          {quest.category} · {quest.difficulty}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-frost-400">
                        {quest.description || quest.shortDescription}
                      </p>

                      {/* Meta info: Time & Verification */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem] text-frost-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {quest.estimatedTime || '30 Mins'}
                        </span>
                        {needsProof && (
                          <span className="flex items-center gap-1 text-gold-300">
                            <Camera size={12} /> Proof Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rewards + actions */}
                  <div className="flex flex-col gap-2.5 border-t border-edge/40 pt-3 sm:items-end sm:border-t-0 sm:pt-0">
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <span className="font-mono text-sm font-bold text-gold-300">+{quest.xp} EXP</span>
                      {quest.statReward && quest.statReward !== 'NONE' && (
                        <span className="rounded-xs border border-shadow-400/50 bg-shadow-500/10 px-2 py-0.5 font-mono text-xs font-bold text-shadow-200">
                          {quest.statReward}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                      <Link
                        to={`/quests/${quest.id}`}
                        className="label-caps inline-flex items-center gap-1 px-1 text-frost-400 transition-colors hover:text-system-200"
                      >
                        <Eye size={14} /> Details
                      </Link>

                      {isCompleted ? (
                        <Badge tone="success">
                          <Check size={12} /> Completed
                        </Badge>
                      ) : isFailed ? (
                        <Badge tone="danger">
                          <XCircle size={12} /> Failed
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="danger"
                            className="min-h-9 px-3 py-1 text-xs"
                            onClick={() => setFailureQuest(quest)}
                          >
                            FAIL
                          </Button>
                          <Button
                            type="button"
                            variant="primary"
                            className="min-h-9 px-3.5 py-1 text-xs"
                            onClick={() => handleExecute(quest)}
                          >
                            <Check size={14} /> COMPLETE
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <EmptyState
              title="No quests match current filter"
              description='Click "CREATE QUEST" to add a custom objective.'
            />
          </div>
        )}

        <p className="flex items-center gap-2 border-t border-penalty-500/30 bg-penalty-500/5 px-4 py-3 text-xs text-penalty-200 sm:px-5">
          <AlertTriangle size={14} className="shrink-0 text-penalty-400" />
          <span>
            <span className="font-display font-bold uppercase tracking-[0.14em] text-penalty-300">Warning:</span> failed quests
            are permanently recorded in your failure history.
          </span>
        </p>
      </SystemWindow>

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
          key={failureQuest.id || failureQuest._id}
          open={Boolean(failureQuest)}
          quest={failureQuest}
          processing={failureProcessing}
          submitted={failureRecorded}
          onClose={() => {
            setFailureQuest(null)
            setFailureRecorded(false)
          }}
          onConfirm={handleConfirmFailure}
          onRecorded={handleConfirmFailure}
        />
      )}

      {/* XP Reward Animation Popup */}
      {xpAnimation && (
        <XPRewardAnimation amount={xpAnimation.xp} visible />
      )}
    </div>
  )
}

export default QuestsPage
