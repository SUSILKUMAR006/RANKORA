import { Check, Circle, Zap } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'

function QuestCard({ icon: Icon = Circle, title, description, difficulty = 'Common', xp = 50, status = 'available', onAction }) {
  const complete = status === 'completed'
  return <Card variant="interactive" className={complete ? 'opacity-70' : ''}><div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Icon size={19} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="font-display font-semibold text-white">{title}</h3><Badge tone={complete ? 'success' : 'difficulty'}>{complete ? 'Complete' : difficulty}</Badge></div><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-1.5 font-mono text-xs text-amber-200"><Zap size={14} />+{xp} XP</span><Button variant={complete ? 'success' : 'secondary'} onClick={onAction} disabled={complete}>{complete ? <><Check size={15} /> Completed</> : 'Accept quest'}</Button></div></div></div></Card>
}

export default QuestCard
