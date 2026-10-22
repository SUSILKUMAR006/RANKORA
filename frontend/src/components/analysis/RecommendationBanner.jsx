import { Lightbulb } from 'lucide-react'
import Badge from '../common/Badge.jsx'

function RecommendationBanner({
  tag = 'SYSTEM RECOMMENDATION',
  title = 'TACTICAL ADJUSTMENT',
  insight,
  recommendation,
  impact = 'HIGH IMPACT',
  tone = 'cyan',
}) {
  // `tone` keeps its legacy keys; each maps onto a System colour role.
  const toneStyles = {
    cyan: {
      accent: 'bg-system-400',
      tagText: 'text-system-300',
      iconBg: 'border-system-400/60 bg-system-500/10 text-system-200',
      badgeTone: 'status',
    },
    emerald: {
      accent: 'bg-clear-400',
      tagText: 'text-clear-300',
      iconBg: 'border-clear-400/60 bg-clear-500/10 text-clear-300',
      badgeTone: 'success',
    },
    violet: {
      accent: 'bg-shadow-400',
      tagText: 'text-shadow-300',
      iconBg: 'border-shadow-400/60 bg-shadow-500/10 text-shadow-300',
      badgeTone: 'shadow',
    },
    rose: {
      accent: 'bg-penalty-400',
      tagText: 'text-penalty-300',
      iconBg: 'border-penalty-400/60 bg-penalty-500/10 text-penalty-300',
      badgeTone: 'danger',
    },
    amber: {
      accent: 'bg-gold-400',
      tagText: 'text-gold-300',
      iconBg: 'border-gold-400/60 bg-gold-500/10 text-gold-300',
      badgeTone: 'difficulty',
    },
  }

  const currentStyle = toneStyles[tone] || toneStyles.cyan
  const showTag = tag && String(tag).toUpperCase() !== 'SYSTEM RECOMMENDATION'

  return (
    <div className="sys-inset relative overflow-hidden p-4 pl-5 sm:p-5 sm:pl-6">
      <span className={`absolute inset-y-0 left-0 w-0.5 ${currentStyle.accent}`} />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge/60 pb-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`grid h-7 w-7 shrink-0 place-items-center border ${currentStyle.iconBg}`}>
            <Lightbulb size={14} />
          </span>
          <div className="min-w-0">
            <p className={`label-caps text-[0.62rem] ${currentStyle.tagText}`}>
              System recommendation{showTag ? ` · ${tag}` : ''}
            </p>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-frost-50">{title}</h4>
          </div>
        </div>

        <Badge tone={currentStyle.badgeTone}>{impact}</Badge>
      </div>

      <div className="mt-3 space-y-2.5">
        {insight && (
          <p className="font-mono text-xs leading-relaxed text-frost-400">
            <span className="font-bold text-frost-100">SIGNAL DETECTED:</span> {insight}
          </p>
        )}
        <div className="border border-edge/60 bg-void-950/70 px-3 py-2.5">
          <p className="text-xs leading-relaxed text-frost-200">
            <span className={`font-mono font-bold ${currentStyle.tagText}`}>ACTION PROTOCOL: </span>
            {recommendation}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RecommendationBanner
