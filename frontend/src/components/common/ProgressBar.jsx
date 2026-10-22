import { motion } from 'framer-motion'

// Gauge colours: xp = system blue (MP-style), quest = clear, boss = penalty (HP-style),
// statistics = shadow, gold = rewards.
const tones = {
  xp: { fill: 'bg-system-400', glow: 'shadow-[0_0_10px_rgba(74,174,255,0.8)]' },
  quest: { fill: 'bg-clear-400', glow: 'shadow-[0_0_10px_rgba(52,217,156,0.7)]' },
  boss: { fill: 'bg-penalty-400', glow: 'shadow-[0_0_10px_rgba(255,77,94,0.8)]' },
  statistics: { fill: 'bg-shadow-400', glow: 'shadow-[0_0_10px_rgba(155,107,255,0.8)]' },
  gold: { fill: 'bg-gold-400', glow: 'shadow-[0_0_10px_rgba(255,194,51,0.7)]' },
}

const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' }

function ProgressBar({ value = 0, max = 100, tone = 'xp', label, showValue = false, className = '', size = 'md' }) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  const style = tones[tone] || tones.xp

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex justify-between gap-3">
          <span className="label-caps text-frost-400">{label}</span>
          {showValue && <span className="font-mono text-xs text-frost-200">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className={`relative ${heights[size] || heights.md} overflow-hidden border border-edge bg-void-950`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax={max}
      >
        <motion.div
          className={`h-full ${style.fill} ${style.glow}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* segment ticks */}
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_calc(10%-1px),rgba(3,5,10,0.85)_calc(10%-1px)_10%)]" />
      </div>
    </div>
  )
}

export default ProgressBar
