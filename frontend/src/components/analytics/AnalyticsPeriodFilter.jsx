import { Calendar } from 'lucide-react'

function AnalyticsPeriodFilter({ periods, activePeriod, onSelectPeriod }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="hidden items-center gap-1.5 font-mono text-xs text-slate-500 sm:flex">
        <Calendar size={13} /> Timeframe:
      </span>
      {periods.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelectPeriod(p.id)}
          className={`rounded-xl border px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition ${
            activePeriod === p.id
              ? 'border-cyan-300/60 bg-cyan-300/15 text-cyan-100 shadow-[0_0_20px_rgba(103,232,249,0.15)]'
              : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

export default AnalyticsPeriodFilter
