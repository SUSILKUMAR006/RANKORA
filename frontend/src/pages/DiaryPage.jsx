import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Check,
  Edit3,
  Feather,
  Flame,
  Lock,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  X,
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

      {/* Inscribe Entry Modal — styled as an open book/journal page */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Write Diary Entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="relative max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-y-auto rounded-[6px] bg-[#0c0e14] shadow-[0_35px_90px_rgba(0,0,0,0.75),0_0_60px_rgba(56,80,110,0.15)]"
              initial={{ opacity: 0, scale: 0.94, rotateX: -6, y: 16 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              {/* moonlit ribbon bookmark */}
              <div className="pointer-events-none absolute -top-1 right-16 h-16 w-5 bg-gradient-to-b from-slate-300 to-slate-500 shadow-[0_0_12px_rgba(203,213,225,0.4)] [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]" />

              <button
                type="button"
                aria-label="Close diary"
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 z-20 rounded-full border border-amber-300/25 bg-[#12141c]/90 p-1.5 text-amber-200/80 transition hover:bg-[#1a1d28] hover:text-amber-100"
              >
                <X size={16} />
              </button>

              <form
                onSubmit={handleSubmit}
                className="relative grid grid-cols-1 sm:grid-cols-2"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                {/* center spine/fold */}
                <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-8 -translate-x-1/2 bg-gradient-to-r from-black/50 via-black/10 to-black/50 sm:block" />
                <div className="pointer-events-none absolute inset-y-3 left-1/2 hidden w-px -translate-x-1/2 bg-amber-200/10 sm:block" />

                {/* LEFT PAGE — details */}
                <div
                  className="relative rounded-l-[6px] bg-[#11131c] px-8 pb-8 pt-9 sm:pr-10"
                  style={{
                    backgroundImage:
                      'radial-gradient(ellipse at top left, rgba(120,140,190,0.08), transparent 55%), repeating-linear-gradient(0deg, rgba(203,213,225,0.035) 0px, rgba(203,213,225,0.035) 1px, transparent 1px, transparent 32px)',
                  }}
                >
                  <div className="flex items-center gap-2 text-amber-300/70">
                    <Feather size={15} />
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em]">
                      Daily Codex &amp; Log
                    </p>
                  </div>
                  <h2
                    className="mt-2 text-[1.9rem] leading-none text-amber-100 sm:text-[2.1rem] [text-shadow:0_0_18px_rgba(251,191,36,0.25)]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Entry Details
                  </h2>
                  <div className="mt-3 h-px w-full bg-gradient-to-r from-amber-200/30 via-amber-200/10 to-transparent" />

                  <div className="mt-6 space-y-5">
                    <div className="grid gap-5 grid-cols-2">
                      <label className="block">
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-amber-200/50">
                          Date
                        </span>
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="mt-1.5 h-10 w-full border-0 border-b-2 border-amber-200/20 bg-transparent px-1 text-sm text-amber-100 outline-none transition focus:border-amber-300/60"
                          style={{ colorScheme: 'dark' }}
                        />
                      </label>

                      <label className="block">
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-amber-200/50">
                          Energy &amp; Mood
                        </span>
                        <select
                          value={form.mood}
                          onChange={(e) => setForm({ ...form, mood: Number(e.target.value) })}
                          className="mt-1.5 h-10 w-full border-0 border-b-2 border-amber-200/20 bg-transparent px-1 text-sm text-amber-100 outline-none transition focus:border-amber-300/60"
                          style={{ colorScheme: 'dark' }}
                        >
                          {[1, 2, 3, 4, 5].map((val) => (
                            <option key={val} value={val} className="bg-[#11131c] text-amber-100">
                              {moodLabels[val]}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="block">
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-emerald-300/70">
                        Key Win / Breakthrough
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. Completed all 7 routine habits & read 12 pages"
                        value={form.keyWin}
                        onChange={(e) => setForm({ ...form, keyWin: e.target.value })}
                        className="mt-1.5 h-10 w-full border-0 border-b-2 border-amber-200/20 bg-transparent px-1 text-sm text-amber-100 outline-none transition placeholder:text-amber-200/25 focus:border-emerald-300/60"
                      />
                    </label>

                    <label className="block">
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-rose-300/70">
                        Obstacle / Resistance
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. Resisted afternoon cravings and fatigue"
                        value={form.obstacle}
                        onChange={(e) => setForm({ ...form, obstacle: e.target.value })}
                        className="mt-1.5 h-10 w-full border-0 border-b-2 border-amber-200/20 bg-transparent px-1 text-sm text-amber-100 outline-none transition placeholder:text-amber-200/25 focus:border-rose-300/60"
                      />
                    </label>

                    <div>
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-amber-200/50">
                        Categories &amp; Tags
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {availableTags.map((tag) => {
                          const isSelected = form.tags.includes(tag)
                          return (
                            <button
                              type="button"
                              key={tag}
                              onClick={() => handleToggleTag(tag)}
                              className={`rounded-full border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wide transition ${
                                isSelected
                                  ? 'border-amber-300/60 bg-amber-400/15 text-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                                  : 'border-amber-200/15 bg-transparent text-amber-200/40 hover:border-amber-200/40 hover:text-amber-200/70'
                              }`}
                            >
                              {tag}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* page number */}
                    <p className="pt-4 text-center font-mono text-[0.6rem] text-amber-200/25">
                      — left page —
                    </p>
                  </div>
                </div>

                {/* RIGHT PAGE — write */}
                <div
                  className="relative rounded-r-[6px] bg-[#0f1119] px-8 pb-8 pt-9 sm:pl-10"
                  style={{
                    backgroundImage:
                      'radial-gradient(ellipse at top right, rgba(120,140,190,0.08), transparent 55%), repeating-linear-gradient(0deg, rgba(203,213,225,0.035) 0px, rgba(203,213,225,0.035) 1px, transparent 1px, transparent 32px)',
                  }}
                >
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300/70">
                    Today&rsquo;s Page
                  </p>
                  <label className="mt-2 block">
                    <input
                      type="text"
                      placeholder="e.g. Day 1: 5:30 AM Wakeup & Heavy Chest Session"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="h-10 w-full border-0 bg-transparent p-0 text-[1.9rem] leading-none text-amber-100 outline-none transition placeholder:text-amber-200/25 sm:text-[2.1rem] [text-shadow:0_0_18px_rgba(251,191,36,0.25)]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    />
                  </label>
                  <div className="mt-3 h-px w-full bg-gradient-to-r from-amber-200/30 via-amber-200/10 to-transparent" />

                  <label className="mt-6 block">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-amber-200/50">
                      Dear Diary&hellip;
                    </span>
                    <textarea
                      required
                      rows={14}
                      placeholder="Write your daily details, workout notes, diet, reading progress, and reflections..."
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="mt-1.5 w-full resize-none border-0 bg-transparent p-0 text-base leading-8 text-amber-100/90 outline-none transition placeholder:text-amber-200/25"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(203,213,225,0.1) 31px, rgba(203,213,225,0.1) 32px)',
                        backgroundPositionY: '4px',
                      }}
                    />
                  </label>

                  <div className="mt-6 flex items-center justify-between border-t border-amber-200/15 pt-5">
                    <p className="font-mono text-[0.6rem] text-amber-200/25">— right page —</p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wide text-amber-200/50 transition hover:text-amber-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-2 rounded-sm bg-amber-400/90 px-5 py-2 font-mono text-xs uppercase tracking-wide text-[#0c0e14] shadow-[0_0_20px_rgba(251,191,36,0.35)] transition hover:bg-amber-300"
                      >
                        <Check size={14} /> Save to Diary
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
