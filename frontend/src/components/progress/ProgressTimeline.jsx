import { motion } from 'framer-motion'
import { CalendarDays, Edit3, ImageOff, Trash2 } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Card from '../common/Card.jsx'
import { formatCheckpointDate } from '../../utils/progressUtils.js'

const milestones = [1, 7, 14, 30, 60, 90, 180, 365]

function ProgressTimeline({ photos, onSelect, onEdit, onDelete }) {
  return (
    <div className="relative space-y-5 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-gradient-to-b before:from-cyan-300/50 before:via-white/10 before:to-transparent sm:before:left-6">
      {photos.map((photo, index) => {
        const milestone = milestones.includes(photo.dayNumber)
        const imgSrc = photo.photoUrl || photo.previewUrl

        return (
          <motion.div
            key={photo._id || photo.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="relative pl-12 sm:pl-16"
          >
            <span
              className={`absolute left-2.5 top-6 z-10 grid h-5 w-5 place-items-center rounded-full border-2 bg-rankora-950 sm:left-3.5 ${
                milestone
                  ? 'border-amber-300 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.35)]'
                  : 'border-cyan-300/50 text-cyan-200'
              }`}
            >
              {milestone ? '✦' : ''}
            </span>

            <Card
              variant={milestone ? 'highlighted' : 'glass'}
              className="overflow-hidden p-0"
            >
              <div className="grid sm:grid-cols-[minmax(12rem,0.8fr)_1fr]">
                <button
                  type="button"
                  onClick={() => onSelect(photo)}
                  className="group relative min-h-48 overflow-hidden border-b border-white/10 bg-black/20 text-left sm:border-b-0 sm:border-r"
                >
                  <span className="absolute left-3 top-3 z-10 rounded-md bg-rankora-950/80 px-2 py-1 font-mono text-[0.65rem] text-cyan-200">
                    DAY {photo.dayNumber}
                  </span>
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={`${photo.label || 'Progress'} checkpoint`}
                      className="h-full min-h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="grid h-full min-h-48 place-items-center text-slate-600">
                      <ImageOff size={26} />
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 text-xs text-white opacity-0 transition group-hover:opacity-100">
                    View checkpoint
                  </span>
                </button>

                <div className="min-w-0 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-white">
                        <CalendarDays size={15} className="text-cyan-200" />
                        {formatCheckpointDate(photo.date)}
                      </p>
                      {milestone && (
                        <Badge tone="rank" className="mt-2">
                          Milestone day
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        aria-label={`Edit checkpoint from ${formatCheckpointDate(
                          photo.date
                        )}`}
                        onClick={() => onEdit(photo)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-cyan-200"
                      >
                        <Edit3 size={15} />
                      </button>
                      {!photo.isOriginal && (
                        <button
                          type="button"
                          aria-label={`Delete checkpoint from ${formatCheckpointDate(
                            photo.date
                          )}`}
                          onClick={() => onDelete(photo)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-rose-400/10 hover:text-rose-200"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {photo.weight && (
                      <div>
                        <p className="label-caps text-slate-600">Weight</p>
                        <p className="mt-1 font-mono text-sm text-slate-200">
                          {photo.weight}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="label-caps text-slate-600">Checkpoint</p>
                      <p className="mt-1 font-mono text-sm text-cyan-200">
                        {photo.isOriginal ? 'Awakening' : 'Day ' + photo.dayNumber}
                      </p>
                    </div>
                  </div>

                  {photo.note && (
                    <p className="mt-5 border-l border-cyan-300/30 pl-3 text-sm leading-6 text-slate-400">
                      {photo.note}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ProgressTimeline
