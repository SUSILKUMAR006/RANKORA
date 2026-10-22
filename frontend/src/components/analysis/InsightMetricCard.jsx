import { Sparkles } from 'lucide-react'

// `tone` keeps its legacy keys; each maps onto a System colour role.
function InsightMetricCard({ icon, label, value, subtext, tone = 'cyan' }) {
  const Icon = icon || Sparkles
  const toneMap = {
    emerald: { box: 'border-clear-400/60 bg-clear-500/10 text-clear-300', bar: 'bg-clear-400 shadow-[0_0_8px_rgba(52,217,156,0.8)]' },
    rose: { box: 'border-penalty-400/60 bg-penalty-500/10 text-penalty-300', bar: 'bg-penalty-400 shadow-[0_0_8px_rgba(255,77,94,0.8)]' },
    violet: { box: 'border-shadow-400/60 bg-shadow-500/10 text-shadow-300', bar: 'bg-shadow-400 shadow-[0_0_8px_rgba(155,107,255,0.8)]' },
    cyan: { box: 'border-system-400/60 bg-system-500/10 text-system-200', bar: 'bg-system-400 shadow-[0_0_8px_rgba(74,174,255,0.8)]' },
    amber: { box: 'border-gold-400/60 bg-gold-500/10 text-gold-300', bar: 'bg-gold-400 shadow-[0_0_8px_rgba(255,194,51,0.7)]' },
  }

  const activeTone = toneMap[tone] || toneMap.cyan

  return (
    <div className="sys-inset relative flex min-w-0 flex-col justify-between overflow-hidden p-4 pl-5 transition-colors hover:border-edge-strong">
      <span className={`absolute inset-y-3 left-0 w-0.5 ${activeTone.bar}`} />
      <div className="flex items-start justify-between gap-2">
        <p className="label-caps text-[0.62rem] text-frost-500">{label}</p>
        <span className={`grid h-7 w-7 shrink-0 place-items-center border ${activeTone.box}`}>
          <Icon size={14} />
        </span>
      </div>

      <div className="mt-3 min-w-0">
        <p className="wrap-break-word font-display text-lg font-bold uppercase leading-tight tracking-[0.06em] text-frost-50">{value}</p>
        {subtext && <p className="mt-1 text-[0.7rem] leading-relaxed text-frost-500">{subtext}</p>}
      </div>
    </div>
  )
}

export default InsightMetricCard
