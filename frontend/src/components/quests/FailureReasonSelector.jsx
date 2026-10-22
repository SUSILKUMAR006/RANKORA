import { AlertTriangle, BatteryLow, BellOff, Clock3, HeartPulse, MoreHorizontal, MousePointer2, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const reasons = [
  ['Forgot', BellOff], ['No Time', Clock3], ['Low Motivation', BatteryLow], ['Unexpected Situation', AlertTriangle],
  ['Too Difficult', TrendingUp], ['Distracted', MousePointer2], ['Not Feeling Well', HeartPulse], ['Other', MoreHorizontal],
]

function FailureReasonSelector({ value, onChange }) {
  return (
    <div>
      <p className="label-caps text-frost-400">Primary reason</p>
      <div className="mt-3 grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
        {reasons.map(([label, Icon]) => (
          <motion.button
            type="button"
            key={label}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange?.(label)}
            aria-pressed={value === label}
            className={`relative flex min-h-11 items-center gap-2.5 rounded-xs border py-2 pl-3 pr-8 text-left font-display text-sm font-semibold uppercase tracking-[0.08em] transition-[background-color,border-color,box-shadow,color] duration-150 ${
              value === label
                ? 'border-system-400 bg-system-500/15 text-frost-50 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
                : 'border-edge bg-void-950/60 text-frost-400 hover:border-edge-strong hover:text-frost-100'
            }`}
          >
            <Icon size={15} className={`shrink-0 ${value === label ? 'text-system-300' : 'text-frost-500'}`} />
            {label}
            {value === label && <Check size={13} className="absolute right-2.5 text-system-300" />}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
export default FailureReasonSelector
