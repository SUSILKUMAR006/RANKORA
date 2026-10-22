import { CalendarDays, Check, X } from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'

// Cells are Monday-first; today's slot is derived for display only.
const todayIndex = () => (new Date().getDay() + 6) % 7

function cellState(value, index, today) {
  if (value === 'done') return 'clear'
  if (value !== 'empty') return 'partial'
  if (index < today) return 'missed'
  return 'idle'
}

const cellStyles = {
  clear: 'border-clear-400 bg-clear-500/15 text-clear-200 shadow-[0_0_14px_-2px_rgba(52,217,156,0.55),inset_0_0_10px_rgba(52,217,156,0.2)]',
  partial: 'border-system-400/60 bg-system-500/10 text-system-200',
  missed: 'border-penalty-500/25 bg-void-900 text-penalty-400/60',
  idle: 'border-edge bg-void-950/70 text-frost-600',
}

const legend = [
  ['Clear', 'border-clear-400 bg-clear-500/30'],
  ['Partial', 'border-system-400/60 bg-system-500/20'],
  ['Missed', 'border-penalty-500/60 bg-penalty-500/20'],
  ['Today', 'border-system-300 bg-transparent'],
]

function WeeklyOverview({ weekly = [], streak = 0 }) {
  const safeWeekly = Array.isArray(weekly) && weekly.length > 0 ? weekly : [
    { day: 'MON', value: 'empty' },
    { day: 'TUE', value: 'empty' },
    { day: 'WED', value: 'empty' },
    { day: 'THU', value: 'empty' },
    { day: 'FRI', value: 'empty' },
    { day: 'SAT', value: 'empty' },
    { day: 'SUN', value: 'empty' },
  ]
  const safeStreak = streak ?? 0
  const today = todayIndex()
  const clearedDays = safeWeekly.filter(({ value }) => value === 'done').length

  return (
    <SystemWindow
      title="This Week"
      icon={<CalendarDays size={14} />}
      actions={
        <span className="font-mono text-sm text-frost-200">
          [<span className="text-clear-300">{clearedDays}</span>/{safeWeekly.length}]
        </span>
      }
    >
      <div className="flex items-center justify-between gap-3">
        <p className="label-caps text-frost-500">Progression rhythm</p>
        <p className="label-caps flex items-center gap-1.5 text-system-300">
          <span className="h-1.5 w-1.5 rotate-45 animate-sys-pulse bg-system-400 shadow-[0_0_6px_rgba(74,174,255,0.9)]" />
          Live log
        </p>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {safeWeekly.map(({ day, value }, index) => {
          const state = cellState(value, index, today)
          const isToday = index === today
          return (
            <div key={day} className="min-w-0 text-center">
              <p className={`font-mono text-[0.62rem] ${isToday ? 'text-system-200' : 'text-frost-600'}`}>{day}</p>
              <div
                title={state === 'clear' ? 'Cleared' : state === 'missed' ? 'No quests cleared' : value === 'empty' ? 'No record' : value}
                className={`mx-auto mt-2 grid aspect-square w-full max-w-12 place-items-center border font-mono text-[0.62rem] font-bold sm:text-xs ${cellStyles[state]} ${
                  isToday ? 'outline-1 outline-offset-2 outline-system-300 shadow-[0_0_14px_-2px_rgba(74,174,255,0.7)]' : ''
                }`}
              >
                {state === 'clear' ? (
                  <Check size={15} strokeWidth={3} />
                ) : state === 'missed' ? (
                  <X size={13} />
                ) : value === 'empty' ? (
                  '—'
                ) : (
                  value
                )}
              </div>
              {isToday && <span className="mx-auto mt-2 block h-1 w-1 rotate-45 bg-system-300 shadow-[0_0_6px_rgba(124,196,255,1)]" />}
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
        {legend.map(([label, swatch]) => (
          <span key={label} className="label-caps flex items-center gap-1.5 text-[0.62rem] text-frost-500">
            <span className={`h-2.5 w-2.5 border ${swatch}`} />
            {label}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-edge/70 pt-5">
        <div className="sys-inset min-w-0 px-2 py-2.5 sm:px-3">
          <p className="label-caps truncate text-[0.6rem] text-frost-600 sm:text-xs">Discipline</p>
          <p className="mt-1 font-display text-base font-bold uppercase tracking-[0.08em] text-frost-50">Rhythm</p>
        </div>
        <div className="sys-inset min-w-0 px-2 py-2.5 sm:px-3">
          <p className="label-caps truncate text-[0.6rem] text-frost-600 sm:text-xs">Streak</p>
          <p className="mt-1 font-display text-base font-bold text-ember-300">
            {safeStreak} <span className="text-xs font-semibold text-frost-500">days</span>
          </p>
        </div>
        <div className="sys-inset min-w-0 px-2 py-2.5 sm:px-3">
          <p className="label-caps truncate text-[0.6rem] text-frost-600 sm:text-xs">Status</p>
          <p className="mt-1 font-display text-base font-bold uppercase tracking-[0.08em] text-system-300">Online</p>
        </div>
      </div>
    </SystemWindow>
  )
}
export default WeeklyOverview
