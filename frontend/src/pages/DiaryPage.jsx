import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Check,
  Edit3,
  Flame,
  Lock,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  Zap,
} from 'lucide-react'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Modal from '../components/common/Modal.jsx'
import { diaryService } from '../services/diaryService.js'
import {
  formatDiaryDate,
  getStoredDiaryEntries,
} from '../utils/diaryUtils.js'

const availableTags = ['Workout', 'Discipline', 'Reading', 'Nutrition', 'Hydration', 'Mindset', 'Recovery', 'Milestone']

function DiaryPage() {
  const [entries, setEntries] = useState(() => getStoredDiaryEntries())
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Form State
  const [form, setForm] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    content: '',
    mood: 4,
    energy: 'Focused',
    keyWin: '',
    obstacle: '',
    tags: ['Workout', 'Discipline'],
  })

  const fetchEntries = async () => {
    const list = await diaryService.getDiaryEntries()
    if (list) setEntries(list)
  }

  useEffect(() => {
    fetchEntries()
    window.addEventListener('storage', fetchEntries)
    window.addEventListener('rankora-diary-updated', fetchEntries)
    return () => {
      window.removeEventListener('storage', fetchEntries)
      window.removeEventListener('rankora-diary-updated', fetchEntries)
    }
  }, [])

  const handleToggleTag = (tag) => {
    setForm((prev) => {
      const exists = prev.tags.includes(tag)
      const nextTags = exists
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
      return { ...prev, tags: nextTags.length > 0 ? nextTags : ['Workout'] }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.content.trim()) return

    await diaryService.createDiaryEntry({
      ...form,
      title: form.title.trim() || `Daily Reflection · ${formatDiaryDate(form.date)}`,
    })
    await fetchEntries()
    setModalOpen(false)
    setForm({
      title: '',
      date: new Date().toISOString().slice(0, 10),
      content: '',
      mood: 4,
      energy: 'Focused',
      keyWin: '',
      obstacle: '',
      tags: ['Workout', 'Discipline'],
    })
  }

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await diaryService.deleteDiaryEntry(deleteTarget._id || deleteTarget.id)
      await fetchEntries()
      setDeleteTarget(null)
    }
  }

  const filteredEntries = entries.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.content?.toLowerCase().includes(search.toLowerCase()) ||
      item.keyWin?.toLowerCase().includes(search.toLowerCase())
    const matchesTag = selectedTag === 'All' || (item.tags && item.tags.includes(selectedTag))
    return matchesSearch && matchesTag
  })

  const moodLabels = {
    1: '1 · Exhausted',
    2: '2 · Low Energy',
    3: '3 · Steady',
    4: '4 · Focused',
    5: '5 · Peak Flow',
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-400/10 text-cyan-200">
              <BookOpen size={14} />
            </span>
            <p className="label-caps text-cyan-300/80">COGNITIVE CODEX / REFLECTIONS</p>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            DAILY DIARY & LOG
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Write your daily reflections, workout notes, mindset breakthroughs, and progress records.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} /> WRITE TODAY'S DIARY
        </Button>
      </motion.header>

      {/* Metrics Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card variant="highlighted">
          <p className="label-caps text-cyan-300/80">TOTAL REFLECTIONS</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-white">
              {entries.length}
            </span>
            <span className="text-xs text-slate-500">entries recorded</span>
          </div>
        </Card>

        <Card variant="glass">
          <p className="label-caps text-slate-400">LATEST ENTRY</p>
          <p className="mt-2 font-display text-base font-semibold text-white truncate">
            {entries[0]?.title || 'No reflections yet'}
          </p>
          <p className="text-xs text-slate-500 font-mono">
            {entries[0] ? formatDiaryDate(entries[0].date) : 'Awaiting your first entry'}
          </p>
        </Card>

        <Card variant="glass">
          <p className="label-caps text-slate-400">ACTIVE THEMES</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {availableTags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-0.5 font-mono text-[0.62rem] text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-48 flex-1 sm:max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search diary entries..."
            className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-300/50"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedTag('All')}
            className={`rounded-lg px-2.5 py-1.5 font-mono text-xs transition ${
              selectedTag === 'All'
                ? 'border border-cyan-300/50 bg-cyan-300/10 text-cyan-200'
                : 'border border-white/10 bg-white/[0.02] text-slate-500 hover:text-white'
            }`}
          >
            All
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`rounded-lg px-2.5 py-1.5 font-mono text-xs transition ${
                selectedTag === tag
                  ? 'border border-cyan-300/50 bg-cyan-300/10 text-cyan-200'
                  : 'border border-white/10 bg-white/[0.02] text-slate-500 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Entries Feed */}
      {filteredEntries.length > 0 ? (
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry._id || entry.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card variant="glass" className="space-y-4 p-5 sm:p-6 transition hover:border-white/20">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-cyan-300">
                        {formatDiaryDate(entry.date)}
                      </span>
                      <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[0.65rem] text-slate-400">
                        Energy: {moodLabels[entry.mood] || 'Steady'}
                      </span>
                    </div>
                    <h2 className="mt-1 font-display text-lg font-semibold text-white">
                      {entry.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Delete entry"
                      onClick={() => setDeleteTarget(entry)}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
                  {entry.content}
                </p>

                {(entry.keyWin || entry.obstacle) && (
                  <div className="grid gap-3 rounded-xl border border-white/5 bg-white/[0.01] p-3.5 sm:grid-cols-2 text-xs">
                    {entry.keyWin && (
                      <div>
                        <span className="label-caps text-emerald-400">Key Breakthrough</span>
                        <p className="mt-0.5 text-slate-300">{entry.keyWin}</p>
                      </div>
                    )}
                    {entry.obstacle && (
                      <div>
                        <span className="label-caps text-amber-400">Resistance Encountered</span>
                        <p className="mt-0.5 text-slate-300">{entry.obstacle}</p>
                      </div>
                    )}
                  </div>
                )}

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {entry.tags.map((t) => (
                      <Badge key={t} tone="category" className="text-[0.65rem]">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card variant="glass" className="py-16 text-center">
          <BookOpen size={36} className="mx-auto text-slate-600 mb-3" />
          <h2 className="font-display text-lg font-semibold text-white">
            YOUR DIARY IS WAITING
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs text-slate-400">
            Write down your daily details, feelings, and workout achievements. Only entries you write will appear here.
          </p>
          <Button onClick={() => setModalOpen(true)} className="mt-5 mx-auto">
            <Plus size={16} /> WRITE FIRST ENTRY
          </Button>
        </Card>
      )}

      {/* Inscribe Entry Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="WRITE DIARY ENTRY"
        eyebrow="DAILY CODEX & LOG"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="label-caps text-slate-400">Entry Title</span>
            <input
              type="text"
              placeholder="e.g. Day 1: 5:30 AM Wakeup & Heavy Chest Session"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-display text-sm text-white outline-none focus:border-cyan-300/50"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="label-caps text-slate-400">Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-white outline-none focus:border-cyan-300/50"
              />
            </label>

            <label className="block">
              <span className="label-caps text-slate-400">Energy & Mood</span>
              <select
                value={form.mood}
                onChange={(e) => setForm({ ...form, mood: Number(e.target.value) })}
                className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-rankora-900 px-3 font-mono text-xs text-white outline-none focus:border-cyan-300/50"
              >
                {[1, 2, 3, 4, 5].map((val) => (
                  <option key={val} value={val}>
                    {moodLabels[val]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="label-caps text-slate-400">Daily Details & Reflections</span>
            <textarea
              required
              rows={5}
              placeholder="Write your daily details, workout notes, diet, reading progress, and reflections..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 font-sans text-sm text-white outline-none focus:border-cyan-300/50 placeholder:text-slate-500"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="label-caps text-slate-400">Key Win / Breakthrough</span>
              <input
                type="text"
                placeholder="e.g. Completed all 7 routine habits & read 12 pages"
                value={form.keyWin}
                onChange={(e) => setForm({ ...form, keyWin: e.target.value })}
                className="mt-1 h-9 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-white outline-none focus:border-cyan-300/50 placeholder:text-slate-600"
              />
            </label>

            <label className="block">
              <span className="label-caps text-slate-400">Obstacle / Resistance</span>
              <input
                type="text"
                placeholder="e.g. Resisted afternoon cravings and fatigue"
                value={form.obstacle}
                onChange={(e) => setForm({ ...form, obstacle: e.target.value })}
                className="mt-1 h-9 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-white outline-none focus:border-cyan-300/50 placeholder:text-slate-600"
              />
            </label>
          </div>

          <div>
            <p className="label-caps text-slate-400">Categories & Tags</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = form.tags.includes(tag)
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`rounded-lg px-2.5 py-1 font-mono text-[0.65rem] transition ${
                      isSelected
                        ? 'border border-cyan-300/50 bg-cyan-400/20 text-cyan-200 shadow-[0_0_10px_rgba(103,232,249,0.15)]'
                        : 'border border-white/10 bg-white/[0.02] text-slate-500 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              CANCEL
            </Button>
            <Button type="submit" variant="primary">
              <Check size={15} /> SAVE TO DIARY
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="DELETE REFLECTION?"
        eyebrow="CONFIRM ACTION"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              CANCEL
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              <Trash2 size={15} /> DELETE
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Are you sure you want to delete the entry "{deleteTarget?.title}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default DiaryPage
