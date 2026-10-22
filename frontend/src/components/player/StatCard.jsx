import { Sparkles } from 'lucide-react'
import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'

function StatCard({ icon, name, value, change, progress, tone = 'statistics' }) {
  const Icon = icon || Sparkles
  return (
    <Card variant="glass" className="min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center border border-system-400/50 bg-system-500/10 text-system-200">
            <Icon size={17} />
          </span>
          <span className="label-caps truncate text-frost-500">{name}</span>
        </div>
        {change && <span className="shrink-0 font-mono text-xs text-clear-300">{change}</span>}
      </div>
      <p className="mt-5 font-display text-4xl font-bold leading-none text-frost-50 sys-glow">{value}</p>
      {progress !== undefined && <ProgressBar value={progress} tone={tone} size="sm" className="mt-4" />}
    </Card>
  )
}

export default StatCard
