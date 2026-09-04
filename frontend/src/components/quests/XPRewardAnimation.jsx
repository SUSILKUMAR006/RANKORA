import { motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'

function XPRewardAnimation({ amount, visible }) {
  return visible ? <motion.div className="pointer-events-none fixed inset-x-0 top-1/3 z-[60] flex justify-center" initial={{ opacity: 0, y: 18, scale: 0.85 }} animate={{ opacity: 1, y: -70, scale: 1 }} exit={{ opacity: 0, y: -130, scale: 1.05 }} transition={{ duration: 1.1, ease: 'easeOut' }}><div className="flex items-center gap-2 rounded-full border border-cyan-300/30 bg-rankora-950/90 px-5 py-3 font-mono text-lg text-cyan-100 shadow-[0_0_40px_rgba(103,232,249,0.3)]"><Sparkles size={17} className="text-cyan-300" />+{amount} XP GAINED<Zap size={16} className="text-amber-200" /></div></motion.div> : null
}
export default XPRewardAnimation
