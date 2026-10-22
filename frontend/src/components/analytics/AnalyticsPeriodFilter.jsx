import { Calendar } from 'lucide-react'

function AnalyticsPeriodFilter({ periods, activePeriod, onSelectPeriod }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="label-caps hidden items-center gap-1.5 text-frost-500 sm:flex">
        <Calendar size={13} className="text-system-400" /> Timeframe
      </span>
      {periods.map((p) => (
        <button
          key={p.id}
          type="button"
          aria-pressed={activePeriod === p.id}
          onClick={() => onSelectPeriod?.(p.id)}
          className={`min-h-9 rounded-xs border px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.14em] transition-[background-color,border-color,box-shadow,color] duration-150 sm:px-3.5 ${
            activePeriod === p.id
              ? 'border-system-400 bg-system-500/15 text-frost-50 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
              : 'border-edge bg-void-900/60 text-frost-400 hover:border-edge-strong hover:text-frost-100'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

export default AnalyticsPeriodFilter
