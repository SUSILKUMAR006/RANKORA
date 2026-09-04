import { AlertTriangle, BatteryLow, BellOff, Clock3, HeartPulse, MoreHorizontal, MousePointer2, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const reasons = [
  ['Forgot', BellOff], ['No Time', Clock3], ['Low Motivation', BatteryLow], ['Unexpected Situation', AlertTriangle],
  ['Too Difficult', TrendingUp], ['Distracted', MousePointer2], ['Not Feeling Well', HeartPulse], ['Other', MoreHorizontal],
]

function FailureReasonSelector({ value, onChange }) {
  return <div><p className="label-caps text-slate-400">PRIMARY REASON</p><div className="mt-3 grid grid-cols-2 gap-2">{reasons.map(([label, Icon]) => <motion.button type="button" key={label} whileTap={{ scale: 0.98 }} onClick={() => onChange(label)} aria-pressed={value === label} className={`relative flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition ${value === label ? 'border-amber-300/50 bg-amber-300/10 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.1)]' : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200'}`}><Icon size={16} />{label}{value === label && <Check size={13} className="absolute right-2 text-amber-200" />}</motion.button>)}</div></div>
}
export default FailureReasonSelector
