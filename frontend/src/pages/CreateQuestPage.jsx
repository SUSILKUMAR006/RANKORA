import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Camera,
  Check,
  Clock,
  Dumbbell,
  Eye,
  Flame,
  HeartPulse,
  NotebookPen,
  Plus,
  Shield,
  Swords,
  Zap,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import { PageHeader } from '../components/common/SectionHeader.jsx'
import SystemWindow from '../components/common/SystemWindow.jsx'
import { getStoredQuests, QUEST_STORAGE_KEY } from '../hooks/useQuestCompletion.js'
import { rankColors } from '../theme/palette.js'
import { addNotification } from '../utils/notificationUtils.js'

const categories = [
  { id: 'Fitness', label: 'Fitness / Workout', icon: Dumbbell, color: 'text-penalty-300' },
  { id: 'Habit', label: 'Habit / Discipline', icon: Flame, color: 'text-ember-400' },
  { id: 'Knowledge', label: 'Studies / Reading', icon: BookOpen, color: 'text-shadow-300' },
  { id: 'Health', label: 'Health / Nutrition', icon: HeartPulse, color: 'text-clear-300' },
  { id: 'Mind', label: 'Mind / Self-Mastery', icon: Brain, color: 'text-system-300' },
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

// Presentation only: option lists for the tile pickers (same values as before).
const questTypes = [
  { value: 'Mandatory', label: 'Mandatory', detail: 'Daily anchor' },
  { value: 'Optional', label: 'Optional', detail: 'Bonus yield' },
]

const verificationModes = [
  { value: 'None', label: 'None', detail: 'One-click verification', icon: Shield },
  { value: 'Photo Required', label: 'Photo Required', detail: 'Snapshot proof', icon: Camera },
  { value: 'photo_note', label: 'Photo + Note', detail: 'Photo + reflection note', icon: NotebookPen },
]

// Difficulty tiles borrow hunter-rank colours: Easy = D, Normal = C, Hard = A.
const difficultyAccent = { Easy: rankColors.D, Normal: rankColors.C, Hard: rankColors.A }

const tileBase = 'relative rounded-xs border text-left transition-[background-color,border-color,box-shadow,color] duration-150'
const tileSelected = 'border-system-400 bg-system-500/15 text-frost-50 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
const tileIdle = 'border-edge bg-void-950/50 text-frost-400 hover:border-edge-strong hover:text-frost-100'

function FieldLabel({ children, as: Component = 'span' }) {
  return <Component className="label-caps mb-1.5 block text-frost-400">{children}</Component>
}

function SelectedMark() {
  return (
    <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center border border-system-400 bg-system-500/30 text-frost-50">
      <Check size={10} strokeWidth={3} />
    </span>
  )
}

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

  const previewCategory = categories.find((cat) => cat.id === form.category)
  const PreviewIcon = previewCategory?.icon || Swords
  const previewVerification = verificationModes.find((mode) => mode.value === form.verification)

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-16">
      <div className="space-y-4">
        <Link
          to="/quests"
          className="label-caps group inline-flex items-center gap-1.5 text-frost-500 transition-colors hover:text-system-200"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" /> Back to quests
        </Link>
        <PageHeader
          eyebrow="Tactical discipline protocol"
          title="Create custom quest"
          description="Inscribe a new daily objective into your RANKORA mission roster."
        />
      </div>

      <form onSubmit={handleSubmit} className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <SystemWindow
          title="Create Quest"
          align="center"
          icon={<Plus size={14} />}
          className="lg:col-start-1 lg:row-start-1 [--panel-glow:rgba(30,144,255,0.24)]"
          bodyClassName="space-y-7 p-5 sm:p-7"
        >
          {/* Quest Title */}
          <label className="block">
            <FieldLabel>Mission Title</FieldLabel>
            <input
              type="text"
              required
              placeholder="e.g. READ 25 PAGES OF SYSTEM DESIGN"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="field font-display font-semibold tracking-[0.06em]"
            />
          </label>

          {/* Category Picker */}
          <fieldset>
            <FieldLabel as="legend">Discipline Category</FieldLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((cat) => {
                const isSelected = form.category === cat.id
                const Icon = cat.icon
                return (
                  <button
                    type="button"
                    key={cat.id}
                    aria-pressed={isSelected}
                    onClick={() => setForm({ ...form, category: cat.id })}
                    className={`${tileBase} flex min-h-14 items-center gap-2.5 p-3 ${isSelected ? tileSelected : tileIdle}`}
                  >
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center border ${
                        isSelected ? 'border-system-400/70 bg-void-950' : 'border-edge bg-void-950'
                      } ${cat.color}`}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="min-w-0 pr-3 font-display text-xs font-bold uppercase leading-4 tracking-[0.08em]">
                      {cat.label}
                    </span>
                    {isSelected && <SelectedMark />}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* Difficulty & XP */}
          <fieldset>
            <FieldLabel as="legend">Difficulty & XP Yield</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-3">
              {difficulties.map((diff) => {
                const isSelected = form.difficulty === diff.id
                return (
                  <button
                    type="button"
                    key={diff.id}
                    aria-pressed={isSelected}
                    onClick={() => handleDifficultyChange(diff)}
                    style={{ '--tile-accent': difficultyAccent[diff.id] }}
                    className={`${tileBase} overflow-hidden p-3.5 ${
                      isSelected
                        ? 'border-(--tile-accent) bg-(--tile-accent)/10 text-frost-50 shadow-[0_0_14px_-3px_var(--tile-accent)]'
                        : tileIdle
                    }`}
                  >
                    <span
                      className={`absolute inset-x-0 top-0 h-0.5 bg-(--tile-accent) ${isSelected ? 'opacity-100' : 'opacity-35'}`}
                    />
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.12em]">
                        <span className="h-1.5 w-1.5 rotate-45 bg-(--tile-accent)" />
                        {diff.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-gold-300">+{diff.xp} XP</span>
                    </div>
                    <p className="mt-1.5 text-xs text-frost-500">{diff.detail}</p>
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* Stat Reward */}
          <fieldset>
            <FieldLabel as="legend">Attribute Reward</FieldLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
              {statRewards.map((sr) => {
                const isSelected = form.statReward === sr.id
                return (
                  <button
                    type="button"
                    key={sr.id}
                    aria-pressed={isSelected}
                    onClick={() => setForm({ ...form, statReward: sr.id })}
                    className={`${tileBase} px-2.5 py-2 font-mono text-[0.7rem] leading-4 ${isSelected ? tileSelected : tileIdle}`}
                  >
                    {sr.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* Quest Type & Verification Mode */}
          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <fieldset>
              <FieldLabel as="legend">Mission Type</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {questTypes.map((option) => {
                  const isSelected = form.type === option.value
                  return (
                    <button
                      type="button"
                      key={option.value}
                      aria-pressed={isSelected}
                      onClick={() => setForm({ ...form, type: option.value })}
                      className={`${tileBase} p-3 ${isSelected ? tileSelected : tileIdle}`}
                    >
                      <span className="block font-display text-sm font-bold uppercase tracking-widest">{option.label}</span>
                      <span className="mt-0.5 block text-xs text-frost-500">{option.detail}</span>
                      {isSelected && <SelectedMark />}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <fieldset>
              <FieldLabel as="legend">Verification Requirement</FieldLabel>
              <div className="grid gap-2 sm:grid-cols-3">
                {verificationModes.map((option) => {
                  const isSelected = form.verification === option.value
                  const Icon = option.icon
                  return (
                    <button
                      type="button"
                      key={option.value}
                      aria-pressed={isSelected}
                      onClick={() => setForm({ ...form, verification: option.value })}
                      className={`${tileBase} flex items-center gap-2.5 p-3 sm:block ${isSelected ? tileSelected : tileIdle}`}
                    >
                      <Icon size={15} className={`shrink-0 ${isSelected ? 'text-system-300' : 'text-frost-500'}`} />
                      <span className="min-w-0 sm:mt-1.5 sm:block">
                        <span className="block font-display text-xs font-bold uppercase tracking-widest">{option.label}</span>
                        <span className="mt-0.5 block text-[0.7rem] leading-4 text-frost-500">{option.detail}</span>
                      </span>
                      {isSelected && <SelectedMark />}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          </div>

          {/* Estimated Time */}
          <label className="block sm:max-w-xs">
            <FieldLabel>Estimated Duration</FieldLabel>
            <input
              type="text"
              placeholder="e.g. 45 Minutes"
              value={form.estimatedTime}
              onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
              className="field font-mono"
            />
          </label>

          {/* Objective Description */}
          <label className="block">
            <FieldLabel>Tactical Objective Description</FieldLabel>
            <textarea
              rows={3}
              placeholder="Detail specific victory conditions for this quest..."
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
              className="field resize-y leading-6"
            />
          </label>
        </SystemWindow>

        {/* Live preview */}
        <motion.aside
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.3 }}
          className="min-w-0 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
        >
          <SystemWindow title="Preview" icon={<Eye size={13} />} bodyClassName="p-0">
            <div className="flex items-start gap-3.5 px-5 py-4">
              <span className={`grid h-9 w-9 shrink-0 place-items-center border border-edge-strong bg-void-950 ${previewCategory?.color || 'text-system-300'}`}>
                <PreviewIcon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <h3
                  className={`wrap-break-word font-display text-base font-bold uppercase leading-snug tracking-[0.08em] ${
                    form.title.trim() ? 'text-frost-50' : 'text-frost-600'
                  }`}
                >
                  {form.title.trim() || 'Untitled quest'}
                </h3>
                <p className="label-caps mt-0.5 text-frost-600">{form.category}</p>
              </div>
            </div>
            {form.objective.trim() && (
              <p className="border-t border-edge/60 px-5 py-3 text-xs leading-5 text-frost-400">{form.objective}</p>
            )}
            <dl className="divide-y divide-edge/60 border-t border-edge/60 text-xs">
              <div className="flex items-center justify-between gap-3 px-5 py-2.5">
                <dt className="label-caps text-frost-500">Reward</dt>
                <dd className="flex items-center gap-1 font-mono font-bold text-gold-300">
                  <Zap size={12} />+{Number(form.xp) || 35} EXP
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-2.5">
                <dt className="label-caps text-frost-500">Stat</dt>
                <dd className="font-mono text-shadow-200">{form.statReward}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-2.5">
                <dt className="label-caps text-frost-500">Type</dt>
                <dd className="font-mono text-frost-200">{form.type}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-2.5">
                <dt className="label-caps text-frost-500">Verification</dt>
                <dd className="text-right font-mono text-frost-200">{previewVerification?.label || form.verification}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-2.5">
                <dt className="label-caps text-frost-500">Duration</dt>
                <dd className="flex min-w-0 items-center gap-1 font-mono text-frost-200">
                  <Clock size={12} className="shrink-0 text-system-400" />
                  <span className="truncate">{form.estimatedTime || '—'}</span>
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2 border-t border-edge/60 px-5 py-3">
              <Badge tone="difficulty">{form.difficulty}</Badge>
              <Badge tone="category">{form.type} objective</Badge>
            </div>
          </SystemWindow>
        </motion.aside>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end lg:col-start-1 lg:row-start-2">
          <Button type="button" variant="ghost" onClick={() => navigate('/quests')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="sm:min-w-52">
            <Check size={16} /> Initialize quest
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateQuestPage
