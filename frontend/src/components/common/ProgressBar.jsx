import { motion } from 'framer-motion'

const tones = {
  xp: 'from-cyan-300 to-blue-400',
  quest: 'from-emerald-300 to-cyan-400',
  boss: 'from-rose-300 to-orange-400',
  statistics: 'from-violet-300 to-fuchsia-400',
}

function ProgressBar({ value = 0, max = 100, tone = 'xp', label, showValue = false, className = '' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  return <div className={className}>
    {(label || showValue) && <div className="mb-2 flex justify-between gap-3 label-caps text-slate-500"><span>{label}</span>{showValue && <span className="text-slate-300">{Math.round(percentage)}%</span>}</div>}
    <div className="h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax={max}>
      <motion.div className={`h-full rounded-full bg-gradient-to-r ${tones[tone]}`} initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.7, ease: 'easeOut' }} />
    </div>
  </div>
}

export default ProgressBar
