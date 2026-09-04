import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'

function XPDisplay({ current = 0, required = 100, level = 1 }) {
  const percentage = Math.round((current / required) * 100)
  return <Card variant="highlighted"><div className="flex items-end justify-between gap-4"><div><p className="label-caps text-cyan-300/70">Experience</p><p className="mt-2 font-mono text-3xl font-medium text-white"><span>{current.toLocaleString()}</span><span className="text-base text-slate-500"> / {required.toLocaleString()} XP</span></p></div><div className="text-right"><p className="label-caps text-slate-500">Level</p><p className="font-mono text-2xl text-cyan-200">{level}</p></div></div><ProgressBar value={current} max={required} tone="xp" showValue className="mt-5" /><p className="mt-3 text-xs text-slate-500">{percentage}% until the next rank threshold</p></Card>
}

export default XPDisplay
