import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'

function StatCard({ icon: Icon, name, value, change, progress, tone = 'statistics' }) {
  return <Card variant="glass" className="min-w-0"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-cyan-200"><Icon size={19} /></span><span className="label-caps text-slate-500">{name}</span></div>{change && <span className="font-mono text-xs text-emerald-300">{change}</span>}</div><p className="mt-5 font-mono text-3xl font-medium tracking-tight text-white">{value}</p>{progress !== undefined && <ProgressBar value={progress} tone={tone} className="mt-4" />}</Card>
}

export default StatCard
