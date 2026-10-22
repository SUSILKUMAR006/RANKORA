import { motion } from 'framer-motion'
import { CalendarDays, Edit3, ImageOff, Trash2 } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import { formatCheckpointDate } from '../../utils/progressUtils.js'

const milestones = [1, 7, 14, 30, 60, 90, 180, 365]

// Vertical System timeline: glowing system-blue spine, diamond nodes,
// each checkpoint a small System window.
function ProgressTimeline({ photos, onSelect, onEdit, onDelete }) {
  return (
    <div className="relative space-y-5">
      {/* spine */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-3 top-6 w-px -translate-x-1/2 bg-linear-to-b from-system-400 via-system-500/50 to-transparent shadow-[0_0_8px_rgba(74,174,255,0.8)] sm:left-4"
      />

      {photos.map((photo, index) => {
        const milestone = milestones.includes(photo.dayNumber)
        const imgSrc = photo.photoUrl || photo.previewUrl

        return (
          <motion.div
            key={photo._id || photo.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.3 }}
            className="relative pl-9 sm:pl-12"
          >
            {/* diamond node */}
            <span aria-hidden="true" className="absolute left-0 top-4 z-10 grid h-6 w-6 place-items-center sm:w-8">
              <span
                className={`grid h-3.5 w-3.5 rotate-45 place-items-center border bg-void-950 ${
                  milestone
                    ? 'border-gold-400 shadow-[0_0_12px_rgba(255,194,51,0.7)]'
                    : 'border-system-400 shadow-[0_0_10px_rgba(74,174,255,0.6)]'
                }`}
              >
                <span className={`h-1.5 w-1.5 ${milestone ? 'bg-gold-300' : 'bg-system-300'}`} />
              </span>
            </span>

            <article
              className={`sys-panel min-w-0 overflow-hidden ${
                milestone ? 'tone-gold [--panel-glow:rgba(255,194,51,0.22)]' : ''
              }`}
            >
              {/* stamp strip */}
              <header className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-(--panel-edge,var(--color-edge)) px-4 py-2">
                <span
                  className={`font-mono text-xs font-bold ${milestone ? 'text-gold-300' : 'text-system-300'}`}
                >
                  DAY {photo.dayNumber}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-frost-400">
                  <CalendarDays size={13} className="text-frost-500" />
                  {formatCheckpointDate(photo.date)}
                </span>
                {milestone && <Badge tone="difficulty">Milestone day</Badge>}

                <div className="ml-auto flex gap-1">
                  <button
                    type="button"
                    aria-label={`Edit checkpoint from ${formatCheckpointDate(
                      photo.date
                    )}`}
                    onClick={() => onEdit?.(photo)}
                    className="border border-transparent p-1.5 text-frost-500 transition-colors hover:border-edge-strong hover:bg-system-500/10 hover:text-system-200"
                  >
                    <Edit3 size={14} />
                  </button>
                  {!photo.isOriginal && (
                    <button
                      type="button"
                      aria-label={`Delete checkpoint from ${formatCheckpointDate(
                        photo.date
                      )}`}
                      onClick={() => onDelete?.(photo)}
                      className="border border-transparent p-1.5 text-frost-500 transition-colors hover:border-penalty-400/60 hover:bg-penalty-500/10 hover:text-penalty-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </header>

              <div className="grid sm:grid-cols-[minmax(11rem,0.8fr)_1fr]">
                <button
                  type="button"
                  onClick={() => onSelect?.(photo)}
                  className="group relative m-3 min-h-44 overflow-hidden rounded-xs border border-edge bg-void-950 text-left transition-[border-color,box-shadow] hover:border-system-400 hover:shadow-[0_0_14px_-2px_rgba(30,144,255,0.6)] sm:mr-0"
                >
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={`${photo.label || 'Progress'} checkpoint`}
                      className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center text-frost-600">
                      <ImageOff size={24} />
                    </span>
                  )}
                  <span className="label-caps absolute inset-x-0 bottom-0 bg-linear-to-t from-void-950/90 to-transparent px-3 pb-2.5 pt-8 text-system-200 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    View checkpoint
                  </span>
                </button>

                <div className="min-w-0 p-4 sm:p-5">
                  <div className="grid grid-cols-2 gap-2.5">
                    {photo.weight && (
                      <div className="sys-inset px-3 py-2.5">
                        <p className="label-caps text-frost-500">Weight</p>
                        <p className="mt-1 font-mono text-sm text-frost-100">{photo.weight}</p>
                      </div>
                    )}
                    <div className="sys-inset px-3 py-2.5">
                      <p className="label-caps text-frost-500">Checkpoint</p>
                      <p
                        className={`mt-1 font-mono text-sm ${
                          photo.isOriginal ? 'text-shadow-200' : milestone ? 'text-gold-200' : 'text-system-200'
                        }`}
                      >
                        {photo.isOriginal ? 'Awakening' : 'Day ' + photo.dayNumber}
                      </p>
                    </div>
                  </div>

                  {photo.note && (
                    <p className="mt-4 border-l-2 border-system-400/50 pl-3 text-sm leading-6 text-frost-300">
                      {photo.note}
                    </p>
                  )}
                </div>
              </div>
            </article>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ProgressTimeline
