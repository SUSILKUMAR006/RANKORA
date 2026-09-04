import { CheckCircle, Lightbulb, Sparkles, TrendingUp, Zap } from 'lucide-react'
import Badge from '../common/Badge.jsx'

function RecommendationBanner({
  tag = 'SYSTEM RECOMMENDATION',
  title = 'TACTICAL ADJUSTMENT',
  insight,
  recommendation,
  impact = 'HIGH IMPACT',
  tone = 'cyan',
}) {
  const toneStyles = {
    cyan: {
      border: 'border-cyan-400/30',
      bg: 'bg-gradient-to-r from-cyan-950/40 via-rankora-900/40 to-cyan-950/20',
      tagText: 'text-cyan-300',
      iconBg: 'bg-cyan-400/10 text-cyan-200 border-cyan-400/25',
      badgeTone: 'quest',
    },
    emerald: {
      border: 'border-emerald-400/30',
      bg: 'bg-gradient-to-r from-emerald-950/40 via-rankora-900/40 to-emerald-950/20',
      tagText: 'text-emerald-300',
      iconBg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25',
      badgeTone: 'success',
    },
    violet: {
      border: 'border-violet-400/30',
      bg: 'bg-gradient-to-r from-violet-950/40 via-rankora-900/40 to-violet-950/20',
      tagText: 'text-violet-300',
      iconBg: 'bg-violet-400/10 text-violet-300 border-violet-400/25',
      badgeTone: 'category',
    },
    rose: {
      border: 'border-rose-400/30',
      bg: 'bg-gradient-to-r from-rose-950/40 via-rankora-900/40 to-rose-950/20',
      tagText: 'text-rose-300',
      iconBg: 'bg-rose-400/10 text-rose-300 border-rose-400/25',
      badgeTone: 'danger',
    },
    amber: {
      border: 'border-amber-400/30',
      bg: 'bg-gradient-to-r from-amber-950/40 via-rankora-900/40 to-amber-950/20',
      tagText: 'text-amber-300',
      iconBg: 'bg-amber-400/10 text-amber-300 border-amber-400/25',
      badgeTone: 'warning',
    },
  }

  const currentStyle = toneStyles[tone] || toneStyles.cyan

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${currentStyle.border} ${currentStyle.bg} p-5 backdrop-blur-md transition`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span
            className={`grid h-7 w-7 place-items-center rounded-lg border ${currentStyle.iconBg}`}
          >
            <Lightbulb size={15} />
          </span>
          <div>
            <p className={`label-caps text-[0.6rem] font-bold ${currentStyle.tagText}`}>
              SYSTEM RECOMMENDATION · {tag}
            </p>
            <h4 className="font-display text-xs font-semibold text-white tracking-wide">
              {title}
            </h4>
          </div>
        </div>

        <Badge tone={currentStyle.badgeTone} className="font-mono text-[0.6rem]">
          {impact}
        </Badge>
      </div>

      <div className="mt-3 space-y-2">
        {insight && (
          <p className="font-mono text-xs leading-relaxed text-slate-400">
            <span className="text-white font-semibold">SIGNAL DETECTED:</span> {insight}
          </p>
        )}
        <div className="rounded-xl border border-white/5 bg-black/30 p-3">
          <p className="text-xs leading-relaxed text-slate-200">
            <span className="font-bold text-cyan-300 font-mono">ACTION PROTOCOL: </span>
            {recommendation}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RecommendationBanner
