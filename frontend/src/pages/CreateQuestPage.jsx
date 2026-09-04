import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Camera,
  Check,
  Code2,
  Dumbbell,
  Flame,
  HeartPulse,
  Plus,
  Scale,
  Shield,
  Sparkles,
  Swords,
  Zap,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import { getStoredQuests, QUEST_STORAGE_KEY } from '../hooks/useQuestCompletion.js'
import { addNotification } from '../utils/notificationUtils.js'

const categories = [
  { id: 'Fitness', label: 'Fitness / Workout', icon: Dumbbell, color: 'text-rose-300 bg-rose-400/10 border-rose-400/25' },
  { id: 'Habit', label: 'Habit / Discipline', icon: Flame, color: 'text-amber-300 bg-amber-400/10 border-amber-400/25' },
  { id: 'Knowledge', label: 'Studies / Reading', icon: BookOpen, color: 'text-violet-300 bg-violet-400/10 border-violet-400/25' },
  { id: 'Health', label: 'Health / Nutrition', icon: HeartPulse, color: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/25' },
  { id: 'Mind', label: 'Mind / Self-Mastery', icon: Brain, color: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/25' },
]

const difficulties = [
  { id: 'Easy', label: 'Easy', xp: 15, detail: '+15 XP baseline' },
  { id: 'Normal', label: 'Normal', xp: 35, detail: '+35 XP standard' },
  { id: 'Hard', label: 'Hard', xp: 60, detail: '+60 XP high yield' },
]

const statRewards = [
  { id: 'NONE', label: 'None' },
  { id: '+1 STR', label: '+1 STR (Strength)' },
  { id: '+2 STR', label: '+2 STR (Strength)' },
  { id: '+1 INT', label: '+1 INT (Intelligence)' },
  { id: '+2 INT', label: '+2 INT (Intelligence)' },
  { id: '+1 VIT', label: '+1 VIT (Vitality)' },
  { id: '+2 VIT', label: '+2 VIT (Vitality)' },
  { id: '+1 AGI', label: '+1 AGI (Agility)' },
  { id: '+1 DISC', label: '+1 DISC (Discipline)' },
  { id: '+2 DISC', label: '+2 DISC (Discipline)' },
]

function CreateQuestPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    objective: '',
    category: 'Fitness',
    difficulty: 'Normal',
    xp: 35,
    statReward: '+1 STR',
    type: 'Mandatory',
    verification: 'None',
    estimatedTime: '30 Minutes',
  })

  const handleDifficultyChange = (diff) => {
    setForm((prev) => ({
      ...prev,
      difficulty: diff.id,
      xp: diff.xp,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    const questId = `custom-quest-${Date.now()}`
    const newQuest = {
      id: questId,
      title: form.title.trim().toUpperCase(),
      shortDescription: form.shortDescription.trim() || form.title.trim(),
      description: form.description.trim() || form.title.trim(),
      objective: form.objective.trim() || form.title.trim(),
      category: form.category,
      difficulty: form.difficulty,
      xp: Number(form.xp) || 35,
      statReward: form.statReward,
      type: form.type,
      verification: form.verification,
      estimatedTime: form.estimatedTime,
      available: 'Today',
      status: 'pending',
      progress: 0,
      target: null,
      unit: '',
      history: [],
      createdAt: new Date().toISOString(),
    }

    const currentQuests = getStoredQuests()
    const updatedQuests = [newQuest, ...currentQuests]

    try {
      localStorage.setItem(
        QUEST_STORAGE_KEY,
        JSON.stringify(
          updatedQuests.map((q) => {
            const clean = { ...q }
            delete clean.icon
            return clean
          })
        )
      )
    } catch {
      // ignore
    }

    // Trigger Notification
    addNotification({
      type: 'system',
      eventKey: `create-quest-${questId}`,
      title: 'CUSTOM MISSION INITIALIZED',
      message: `"${newQuest.title}" registered with ${newQuest.xp} XP & ${newQuest.statReward} reward.`,
      tone: 'cyan',
      iconName: 'Swords',
      link: `/quests/${questId}`,
    })

    navigate('/quests')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-16">
      {/* Header with Back Button */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 border-b border-white/10 pb-6"
      >
        <Link
          to="/quests"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 transition hover:text-cyan-200"
        >
          <ArrowLeft size={14} /> Back to Quests
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
              <Plus size={14} />
            </span>
            <p className="label-caps text-cyan-300/80">TACTICAL DISCIPLINE PROTOCOL</p>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            CREATE CUSTOM QUEST
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Inscribe a new daily objective into your RANKORA mission roster.
          </p>
        </div>
      </motion.header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card variant="glass" className="space-y-6">
          {/* Quest Title */}
          <label className="block">
            <span className="label-caps text-slate-400">Mission Title</span>
            <input
              type="text"
              required
              placeholder="e.g. READ 25 PAGES OF SYSTEM DESIGN"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 font-display text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-300/50 focus:bg-white/[0.06]"
            />
          </label>

          {/* Category Picker */}
          <div>
            <p className="label-caps text-slate-400">Discipline Category</p>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {categories.map((cat) => {
                const isSelected = form.category === cat.id
                const Icon = cat.icon
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setForm({ ...form, category: cat.id })}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? `${cat.color} ring-1 ring-cyan-300/50 shadow-[0_0_16px_rgba(103,232,249,0.15)]`
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="font-display text-xs font-semibold">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Difficulty & XP */}
          <div>
            <p className="label-caps text-slate-400">Difficulty & XP Yield</p>
            <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
              {difficulties.map((diff) => {
                const isSelected = form.difficulty === diff.id
                return (
                  <button
                    type="button"
                    key={diff.id}
                    onClick={() => handleDifficultyChange(diff)}
                    className={`rounded-xl border p-3.5 text-left transition ${
                      isSelected
                        ? 'border-amber-300/60 bg-amber-400/10 shadow-[0_0_16px_rgba(251,191,36,0.15)]'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-semibold text-white">
                        {diff.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-300">
                        +{diff.xp} XP
                      </span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-slate-400">{diff.detail}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Stat Reward & Quest Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label-caps text-slate-400">Attribute Reward</span>
              <select
                value={form.statReward}
                onChange={(e) => setForm({ ...form, statReward: e.target.value })}
                className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-rankora-900 px-3 font-mono text-xs text-white outline-none focus:border-cyan-300/50"
              >
                {statRewards.map((sr) => (
                  <option key={sr.id} value={sr.id}>
                    {sr.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="label-caps text-slate-400">Mission Type</span>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-rankora-900 px-3 font-mono text-xs text-white outline-none focus:border-cyan-300/50"
              >
                <option value="Mandatory">Mandatory (Daily Anchor)</option>
                <option value="Optional">Optional (Bonus Yield)</option>
              </select>
            </label>
          </div>

          {/* Verification Mode & Estimated Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label-caps text-slate-400">Verification Requirement</span>
              <select
                value={form.verification}
                onChange={(e) => setForm({ ...form, verification: e.target.value })}
                className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-rankora-900 px-3 font-mono text-xs text-white outline-none focus:border-cyan-300/50"
              >
                <option value="None">None (One-Click Verification)</option>
                <option value="Photo Required">Photo Required (Snapshot Proof)</option>
                <option value="photo_note">Photo + Reflection Note</option>
              </select>
            </label>

            <label className="block">
              <span className="label-caps text-slate-400">Estimated Duration</span>
              <input
                type="text"
                placeholder="e.g. 45 Minutes"
                value={form.estimatedTime}
                onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-white outline-none focus:border-cyan-300/50"
              />
            </label>
          </div>

          {/* Objective Description */}
          <label className="block">
            <span className="label-caps text-slate-400">Tactical Objective Description</span>
            <textarea
              rows={3}
              placeholder="Detail specific victory conditions for this quest..."
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 font-sans text-sm text-white outline-none focus:border-cyan-300/50"
            />
          </label>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate('/quests')}>
            CANCEL
          </Button>
          <Button type="submit" variant="primary" className="min-w-44">
            <Check size={16} /> INITIALIZE QUEST
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateQuestPage
