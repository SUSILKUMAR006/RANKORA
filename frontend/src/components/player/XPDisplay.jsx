import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'

function XPDisplay({ current = 0, required = 100, level = 1 }) {
  const percentage = Math.round((current / required) * 100)
  return (
    <Card variant="highlighted">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="label-caps text-system-300">Experience</p>
          <p className="mt-2 font-mono text-2xl font-bold text-frost-50 sm:text-3xl">
            <span>{current.toLocaleString()}</span>
            <span className="text-base font-normal text-frost-500"> / {required.toLocaleString()} XP</span>
          </p>
        </div>
        <div className="text-right">
          <p className="label-caps text-frost-500">Level</p>
          <p className="font-display text-4xl font-bold leading-none text-frost-50 sys-glow">{level}</p>
        </div>
      </div>
      <ProgressBar value={current} max={required} tone="xp" showValue className="mt-5" />
      <p className="mt-3 font-mono text-xs text-system-200">{percentage}% until the next rank threshold</p>
    </Card>
  )
}

export default XPDisplay
