import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Check, Feather, Plus, Search, Trash2, X } from 'lucide-react'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Modal from '../components/common/Modal.jsx'
import { PageHeader } from '../components/common/SectionHeader.jsx'
import { diaryService } from '../services/diaryService.js'
import {
  formatDiaryDate,
  getStoredDiaryEntries,
} from '../utils/diaryUtils.js'

// Mood → coloured square chip (presentation only).
const moodChip = {
  1: { box: 'border-penalty-400/60 bg-penalty-500/10 text-penalty-200', dot: 'bg-penalty-400 shadow-[0_0_6px_rgba(255,77,94,0.8)]' },
  2: { box: 'border-ember-400/60 bg-ember-500/10 text-ember-300', dot: 'bg-ember-400 shadow-[0_0_6px_rgba(255,138,61,0.8)]' },
  3: { box: 'border-edge-strong bg-void-850 text-frost-300', dot: 'bg-frost-400' },
  4: { box: 'border-system-400/60 bg-system-500/10 text-system-200', dot: 'bg-system-400 shadow-[0_0_6px_rgba(74,174,255,0.8)]' },
  5: { box: 'border-clear-400/60 bg-clear-500/10 text-clear-200', dot: 'bg-clear-400 shadow-[0_0_6px_rgba(52,217,156,0.8)]' },
}

const tabActive = 'border-system-400 bg-system-500/15 text-frost-50 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
const tabIdle = 'border-edge text-frost-400 hover:border-edge-strong hover:text-frost-100'

function formatLogTime(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function Bracketed({ children }) {
  return (
    <>
      <span className="text-system-400">[</span> {children} <span className="text-system-400">]</span>
    </>
  )
}

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
      <PageHeader
        eyebrow="Records / Reflections"
        title={<Bracketed>Hunter&rsquo;s Log</Bracketed>}
        description="Write your daily reflections, workout notes, mindset breakthroughs, and progress records."
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Write today&rsquo;s log
          </Button>
        }
      />

      {/* Metrics Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card variant="highlighted">
          <p className="label-caps text-system-300">Total reflections</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold leading-none text-frost-50 sys-glow">
              {entries.length}
            </span>
            <span className="label-caps text-frost-500">entries recorded</span>
          </div>
        </Card>

        <Card>
          <p className="label-caps text-frost-500">Latest entry</p>
          <p className="mt-2 truncate font-display text-base font-bold uppercase tracking-[0.08em] text-frost-50">
            {entries[0]?.title || 'No reflections yet'}
          </p>
          <p className="mt-0.5 font-mono text-xs text-frost-500">
            {entries[0] ? formatDiaryDate(entries[0].date) : 'Awaiting your first entry'}
          </p>
        </Card>

        <Card>
          <p className="label-caps text-frost-500">Active themes</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {availableTags.slice(0, 4).map((tag) => (
              <Badge key={tag} tone="category">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-frost-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search log entries..."
            className="field pl-9"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedTag('All')}
            className={`rounded-xs border px-2.5 py-1.5 font-display text-xs font-bold uppercase tracking-[0.14em] transition-[border-color,background-color,color,box-shadow] ${
              selectedTag === 'All' ? tabActive : tabIdle
            }`}
          >
            All
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`rounded-xs border px-2.5 py-1.5 font-display text-xs font-bold uppercase tracking-[0.14em] transition-[border-color,background-color,color,box-shadow] ${
                selectedTag === tag ? tabActive : tabIdle
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Log Entries Feed */}
      {filteredEntries.length > 0 ? (
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => {
            const mood = moodChip[entry.mood] || moodChip[3]
            const time = formatLogTime(entry.createdAt)
            return (
              <motion.article
                key={entry._id || entry.id || index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index, 8) * 0.04 }}
                className="sys-panel min-w-0"
              >
                {/* Log stamp strip */}
                <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-edge px-4 py-2.5 sm:px-5">
                  <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-system-400 shadow-[0_0_8px_rgba(74,174,255,0.9)]" />
                  <span className="font-mono text-xs text-system-300">
                    LOG · {formatDiaryDate(entry.date)}
                    {time && <span className="text-frost-500"> · {time}</span>}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xs border px-2 py-0.5 font-display text-[0.7rem] font-bold uppercase leading-4 tracking-[0.14em] ${mood.box}`}
                  >
                    <span className={`h-2 w-2 shrink-0 ${mood.dot}`} />
                    Energy: {moodLabels[entry.mood] || 'Steady'}
                  </span>
                  <button
                    type="button"
                    aria-label="Delete entry"
                    onClick={() => setDeleteTarget(entry)}
                    className="ml-auto border border-transparent p-1.5 text-frost-500 transition-colors hover:border-penalty-400/60 hover:bg-penalty-500/10 hover:text-penalty-200"
                  >
                    <Trash2 size={15} />
                  </button>
                </header>

                <div className="space-y-4 p-4 sm:p-6">
                  <h2 className="font-display text-lg font-bold uppercase tracking-[0.08em] text-frost-50 sm:text-xl">
                    {entry.title}
                  </h2>

                  <p className="whitespace-pre-line text-[0.95rem] leading-7 text-frost-200">
                    {entry.content}
                  </p>

                  {(entry.keyWin || entry.obstacle) && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {entry.keyWin && (
                        <div className="sys-inset px-3.5 py-3">
                          <span className="label-caps flex items-center gap-2 text-clear-300"><span className="h-1.5 w-1.5 rotate-45 bg-clear-400" />Key breakthrough</span>
                          <p className="mt-1 text-sm leading-6 text-frost-200">{entry.keyWin}</p>
                        </div>
                      )}
                      {entry.obstacle && (
                        <div className="sys-inset px-3.5 py-3">
                          <span className="label-caps flex items-center gap-2 text-penalty-300"><span className="h-1.5 w-1.5 rotate-45 bg-penalty-400" />Resistance encountered</span>
                          <p className="mt-1 text-sm leading-6 text-frost-200">{entry.obstacle}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 border-t border-edge/60 pt-4">
                      {entry.tags.map((t) => (
                        <Badge key={t} tone="category">
                          #{t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            )
          })}
        </div>
      ) : (
        <Card className="px-6 py-14 text-center">
          <span className="mx-auto mb-4 grid h-12 w-12 place-items-center border border-edge-strong bg-void-950 text-system-300">
            <BookOpen size={22} />
          </span>
          <h2 className="font-display text-lg font-bold uppercase tracking-[0.14em] text-frost-50">
            Your log is waiting
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-frost-400">
            Write down your daily details, feelings, and workout achievements. Only entries you write will appear here.
          </p>
          <Button onClick={() => setModalOpen(true)} className="mx-auto mt-6">
            <Plus size={16} /> Write first entry
          </Button>
        </Card>
      )}

      {/* Write Entry window */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-void-950/80 p-3 backdrop-blur-[3px] sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Write Diary Entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="sys-panel max-h-[calc(100vh-1.5rem)] w-full max-w-4xl overflow-y-auto [--panel-glow:rgba(30,144,255,0.35)]"
              initial={{ scaleY: 0.02, scaleX: 0.6, opacity: 0 }}
              animate={{ scaleY: 1, scaleX: 1, opacity: 1, transition: { scaleX: { duration: 0.16 }, scaleY: { delay: 0.12, duration: 0.26, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.1 } } }}
              exit={{ scaleY: 0.02, opacity: 0, transition: { duration: 0.16 } }}
              onClick={(event) => event.stopPropagation()}
            >
              <header className="relative border-b border-edge px-12 py-4 text-center">
                <p className="label-caps flex items-center justify-center gap-2 text-system-400">
                  <Feather size={13} /> System
                </p>
                <h2 className="sys-title mt-1 text-lg sm:text-xl">
                  <Bracketed>New log entry</Bracketed>
                </h2>
                <button
                  type="button"
                  aria-label="Close diary"
                  onClick={() => setModalOpen(false)}
                  className="absolute right-3 top-3 border border-transparent p-1.5 text-frost-500 transition-colors hover:border-edge hover:text-frost-50"
                >
                  <X size={16} />
                </button>
              </header>

              <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)]">
                  {/* Details */}
                  <div className="space-y-5 border-b border-edge p-4 sm:p-6 lg:border-b-0 lg:border-r">
                    <p className="label-caps text-frost-500">Entry details</p>

                    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
                      <label className="block">
                        <span className="label-caps mb-1.5 block text-frost-400">Date</span>
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="field font-mono"
                        />
                      </label>

                      <label className="block">
                        <span className="label-caps mb-1.5 block text-frost-400">Energy &amp; mood</span>
                        <select
                          value={form.mood}
                          onChange={(e) => setForm({ ...form, mood: Number(e.target.value) })}
                          className="field"
                        >
                          {[1, 2, 3, 4, 5].map((val) => (
                            <option key={val} value={val} className="bg-void-900 text-frost-100">
                              {moodLabels[val]}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="block">
                      <span className="label-caps mb-1.5 block text-clear-300">Key win / breakthrough</span>
                      <input
                        type="text"
                        placeholder="e.g. Completed all 7 routine habits & read 12 pages"
                        value={form.keyWin}
                        onChange={(e) => setForm({ ...form, keyWin: e.target.value })}
                        className="field"
                      />
                    </label>

                    <label className="block">
                      <span className="label-caps mb-1.5 block text-penalty-300">Obstacle / resistance</span>
                      <input
                        type="text"
                        placeholder="e.g. Resisted afternoon cravings and fatigue"
                        value={form.obstacle}
                        onChange={(e) => setForm({ ...form, obstacle: e.target.value })}
                        className="field"
                      />
                    </label>

                    <div>
                      <p className="label-caps mb-2 text-frost-400">Categories &amp; tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {availableTags.map((tag) => {
                          const isSelected = form.tags.includes(tag)
                          return (
                            <button
                              type="button"
                              key={tag}
                              onClick={() => handleToggleTag(tag)}
                              aria-pressed={isSelected}
                              className={`inline-flex items-center gap-1 rounded-xs border px-2.5 py-1 font-display text-xs font-bold uppercase tracking-[0.14em] transition-[border-color,background-color,color,box-shadow] ${
                                isSelected ? tabActive : tabIdle
                              }`}
                            >
                              {isSelected && <Check size={11} strokeWidth={3} />}
                              {tag}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Write */}
                  <div className="space-y-5 p-4 sm:p-6">
                    <label className="block">
                      <span className="label-caps mb-1.5 block text-system-300">Today&rsquo;s page</span>
                      <input
                        type="text"
                        placeholder="e.g. Day 1: 5:30 AM Wakeup & Heavy Chest Session"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="field font-display text-lg font-bold uppercase tracking-[0.08em] placeholder:normal-case placeholder:tracking-normal"
                      />
                    </label>

                    <label className="block">
                      <span className="label-caps mb-1.5 block text-frost-400">Dear diary&hellip;</span>
                      <textarea
                        required
                        rows={14}
                        placeholder="Write your daily details, workout notes, diet, reading progress, and reflections..."
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        className="field min-h-64 resize-y text-[0.95rem] leading-7"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3 border-t border-edge px-4 py-4 sm:px-6">
                  <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Check size={15} /> Save to log
                  </Button>
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
        title="Delete log entry?"
        eyebrow="Confirm action"
        tone="penalty"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              <Trash2 size={15} /> Delete
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-frost-300">
          Are you sure you want to delete the entry &ldquo;<span className="text-frost-50">{deleteTarget?.title}</span>&rdquo;? This
          action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default DiaryPage
