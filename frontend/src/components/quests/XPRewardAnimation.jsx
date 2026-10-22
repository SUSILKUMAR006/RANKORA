import { motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'

function XPRewardAnimation({ amount, visible }) {
  return visible ? (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-1/3 z-60 flex justify-center px-4"
      initial={{ opacity: 0, y: 18, scale: 0.85 }}
      animate={{ opacity: 1, y: -70, scale: 1 }}
      exit={{ opacity: 0, y: -130, scale: 1.05 }}
      transition={{ duration: 1.1, ease: 'easeOut' }}
    >
      <motion.div
        className="sys-panel tone-gold origin-center px-6 py-4 text-center [--panel-glow:rgba(255,194,51,0.35)]"
        initial={{ scaleY: 0.05 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="label-caps flex items-center justify-center gap-2 text-gold-300">
          <Sparkles size={13} className="text-gold-400" />
          Reward
          <Zap size={13} className="text-gold-400" />
        </p>
        <p className="mt-1 font-display text-4xl font-bold leading-none text-gold-300 sys-glow sm:text-5xl">
          +<span className="font-mono">{amount}</span> EXP
        </p>
        <p className="label-caps mt-2 text-frost-400">Gained</p>
      </motion.div>
    </motion.div>
  ) : null
}

export default XPRewardAnimation
