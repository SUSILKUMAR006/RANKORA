import { AnimatePresence, motion } from 'framer-motion'
import { Award, Check, Sparkles, Trophy, Zap } from 'lucide-react'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import SystemMessage from '../common/SystemMessage.jsx'

function AchievementUnlockModal({ achievement, onClose }) {
  if (!achievement) return null

  const {
    name = 'Achievement Unlocked',
    description = 'You have accomplished a new milestone.',
    icon: Icon = Trophy,
    category = 'System',
    points = 100,
    rarity = 'Rare',
  } = achievement

  return (
    <Modal
      open={Boolean(achievement)}
      onClose={onClose}
      title="ACHIEVEMENT UNLOCKED"
      eyebrow="RANKORA SYSTEM NOTIFICATION"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <span className="font-mono text-xs text-slate-500">Milestone Recorded</span>
          <Button onClick={onClose} className="min-w-32">
            <Check size={16} /> CLAIM & CONTINUE
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        {/* Animated Radiant Burst & Icon */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Animated Glow Rings */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute h-32 w-32 rounded-full bg-cyan-400/20 blur-xl"
          />
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute h-40 w-40 rounded-full bg-amber-400/15 blur-2xl"
          />

          {/* Rotating Halo Border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute h-24 w-24 rounded-3xl border border-dashed border-cyan-300/40"
          />

          {/* Icon Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="relative z-10 grid h-20 w-20 place-items-center rounded-3xl border border-cyan-300/50 bg-gradient-to-br from-cyan-400/20 via-rankora-900 to-rankora-950 text-cyan-200 shadow-[0_0_40px_rgba(103,232,249,0.35)]"
          >
            <Icon size={36} strokeWidth={2.2} />
          </motion.div>
        </div>

        {/* Header Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-5 flex items-center gap-2"
        >
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-300/30 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider text-amber-200">
            <Sparkles size={11} /> {rarity}
          </span>
          <span className="inline-flex items-center rounded-md border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider text-cyan-200">
            {category}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
        >
          {name}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-300"
        >
          {description}
        </motion.p>

        {/* Reward Stat Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-2 font-mono text-sm font-semibold text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.12)]"
        >
          <Zap size={16} className="text-amber-300" />
          <span>+{points} Achievement Points (AP)</span>
        </motion.div>

        {/* System Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="mt-6 w-full text-left"
        >
          <SystemMessage
            eyebrow="RANKORA CODEX RECORD"
            title="ACHIEVEMENT UNLOCKED & RECORDED"
            message="Your progression data has been permanently logged to system memory. New honors await."
          />
        </motion.div>
      </div>
    </Modal>
  )
}

export default AchievementUnlockModal
