import { Sparkles } from 'lucide-react'
import Card from '../common/Card.jsx'

function InsightMetricCard({ icon, label, value, subtext, tone = 'cyan' }) {
  const Icon = icon || Sparkles
  const toneMap = {
    emerald: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/25',
    rose: 'text-rose-300 bg-rose-400/10 border-rose-400/25',
    violet: 'text-violet-300 bg-violet-400/10 border-violet-400/25',
    cyan: 'text-cyan-200 bg-cyan-400/10 border-cyan-400/25',
    amber: 'text-amber-300 bg-amber-400/10 border-amber-400/25',
  }

  const activeTone = toneMap[tone] || toneMap.cyan

  return (
    <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-2">
        <p className="label-caps text-[0.62rem] text-slate-500">{label}</p>
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${activeTone}`}
        >
          <Icon size={14} />
        </span>
      </div>

      <div className="mt-3">
        <p className="font-display text-sm font-semibold text-white">{value}</p>
        {subtext && (
          <p className="mt-0.5 text-[0.68rem] leading-relaxed text-slate-400">
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}

export default InsightMetricCard
