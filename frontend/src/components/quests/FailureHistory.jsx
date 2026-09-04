import { AlertTriangle, Clock3 } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from '../common/Card.jsx'

function FailureHistory({ history = [] }) {
  const failures = history.filter((item) => item.status === 'FAILED').slice(0, 5)
  return <Card variant="glass"><p className="label-caps text-amber-200/70">FAILURE HISTORY</p>{failures.length ? <div className="mt-4 space-y-3">{failures.map((failure, index) => <motion.div key={`${failure.date}-${failure.time || index}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-200" /><div className="min-w-0"><p className="text-sm text-slate-300">{failure.date}{failure.time && <span className="ml-2 text-xs text-slate-600">{failure.time}</span>}</p><p className="mt-1 font-mono text-xs text-amber-200">{failure.reason || 'Recorded'}</p>{failure.note && <p className="mt-1 text-xs leading-5 text-slate-500">{failure.note}</p>}</div></motion.div>)}</div> : <div className="mt-5 flex items-start gap-3 text-sm text-slate-500"><Clock3 size={16} className="mt-0.5" /><span>NO FAILURE DATA<br /><span className="text-xs text-slate-600">Complete or attempt missions to generate failure records.</span></span></div>}</Card>
}
export default FailureHistory
