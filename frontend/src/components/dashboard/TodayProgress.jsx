import { motion } from 'framer-motion'
import { Check, Circle, Crosshair, X } from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'
import { palette } from '../../theme/palette.js'

// Segmented ring: one segment per quest, ordered cleared → failed → remaining.
function SegmentedGauge({ completed, failed, total, percentage }) {
  const size = 176
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const segments = Math.max(total, 1)
  const segmentLength = circumference / segments
  const gap = total > 1 ? Math.min(6, segmentLength * 0.25) : 0

  const colourFor = (index) => {
    if (total === 0) return palette.edge
    if (index < completed) return palette.clear
    if (index < completed + failed) return palette.penalty
    return palette.edge
  }

  return (
    <div className="relative grid h-44 w-44 shrink-0 place-items-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        {/* faint outer guide ring */}
        <circle cx={size / 2} cy={size / 2} r={radius + stroke} fill="none" stroke={palette.edge} strokeOpacity="0.35" strokeWidth="1" />
        {Array.from({ length: segments }).map((_, index) => {
          const colour = colourFor(index)
          const lit = colour !== palette.edge
          return (
            <motion.circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colour}
              strokeOpacity={lit ? 1 : 0.6}
              strokeWidth={stroke}
              strokeDasharray={`${Math.max(segmentLength - gap, 0.5)} ${circumference}`}
              strokeDashoffset={-index * segmentLength}
              style={lit ? { filter: `drop-shadow(0 0 4px ${colour})` } : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.2 }}
            />
          )
        })}
        {/* inner tick ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - stroke - 4}
          fill="none"
          stroke={palette.system}
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
      </svg>
      <div className="relative text-center">
        <p className="font-display text-5xl font-bold leading-none text-frost-50 sys-glow">
          {percentage}
          <span className="text-2xl text-frost-400">%</span>
        </p>
        <p className="label-caps mt-1.5 text-system-300">Cleared</p>
      </div>
    </div>
  )
}

function TodayProgress({ quests = [] }) {
  const safeQuests = Array.isArray(quests) ? quests : []
  const completed = safeQuests.filter((quest) => quest.status === 'completed').length
  const failed = safeQuests.filter((quest) => quest.status === 'failed').length
  const remaining = Math.max(0, safeQuests.length - completed - failed)
  const percentage = safeQuests.length
    ? Math.round((completed / safeQuests.length) * 100)
    : 0

  const rows = [
    {
      label: 'Completed',
      value: completed,
      icon: Check,
      box: 'border-clear-400/70 bg-clear-500/10 text-clear-300',
      text: 'text-clear-200',
    },
    {
      label: 'Remaining',
      value: remaining,
      icon: Circle,
      box: 'border-system-400/60 bg-system-500/10 text-system-300',
      text: 'text-frost-50',
    },
    {
      label: 'Failed',
      value: failed,
      icon: X,
      box: 'border-penalty-400/60 bg-penalty-500/10 text-penalty-300',
      text: 'text-penalty-200',
    },
  ]

  return (
    <SystemWindow
      title="Today's Progress"
      icon={<Crosshair size={14} />}
      actions={
        <span className="font-mono text-sm text-frost-200">
          [<span className="text-clear-300">{completed}</span>/{safeQuests.length}]
        </span>
      }
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
        <SegmentedGauge completed={completed} failed={failed} total={safeQuests.length} percentage={percentage} />

        <div className="w-full space-y-2 sm:max-w-56">
          <p className="label-caps text-frost-500">Daily objectives</p>
          {rows.map(({ label, value, icon: Icon, box, text }) => (
            <div key={label} className="sys-inset flex items-center justify-between gap-3 px-3 py-2">
              <span className="flex items-center gap-2.5">
                <span className={`grid h-6 w-6 place-items-center border ${box}`}>
                  <Icon size={13} />
                </span>
                <span className="label-caps text-frost-300">{label}</span>
              </span>
              <span className={`font-display text-xl font-bold leading-none ${text}`}>{value}</span>
            </div>
          ))}
          <p className="pt-1 font-mono text-xs text-frost-500">
            <span className="text-system-300">{remaining}</span> quests remaining
          </p>
        </div>
      </div>
    </SystemWindow>
  )
}
export default TodayProgress
