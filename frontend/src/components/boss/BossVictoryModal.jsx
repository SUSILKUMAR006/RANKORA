import { motion } from 'framer-motion'
import { Award, Check, Sparkles, Swords, Trophy, Zap } from 'lucide-react'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import SystemMessage from '../common/SystemMessage.jsx'

function BossVictoryModal({ open, boss, onClose }) {
  if (!boss) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="BOSS DEFEATED"
      eyebrow="RANKORA LEGENDARY VICTORY"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <span className="font-mono text-xs text-slate-500">Bounty Claimed</span>
          <Button onClick={onClose} variant="primary" className="min-w-36">
            <Check size={16} /> CLAIM REWARD
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        {/* Animated Victory Burst & Core */}
        <div className="relative my-3 flex items-center justify-center">
          {/* Pulsing Aura Rings */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute h-36 w-36 rounded-full bg-emerald-400/25 blur-xl"
          />
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute h-44 w-44 rounded-full bg-amber-400/20 blur-2xl"
          />

          {/* Rotating Celestial Rays */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            className="absolute h-28 w-28 rounded-full border border-dashed border-emerald-300/40"
          />

          {/* Center Trophy Crest */}
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 16 }}
            className="relative z-10 grid h-24 w-24 place-items-center rounded-3xl border border-emerald-300/50 bg-gradient-to-br from-emerald-400/25 via-rankora-900 to-rankora-950 text-emerald-200 shadow-[0_0_50px_rgba(52,211,153,0.4)]"
          >
            <Trophy size={42} strokeWidth={2.2} />
          </motion.div>
        </div>

        {/* Victory Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4 flex items-center gap-2"
        >
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
            <Sparkles size={11} /> WEEKLY BOSS VANQUISHED
          </span>
          <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[0.68rem] text-slate-400">
            {boss.weekLabel}
          </span>
        </motion.div>

        {/* Boss Defeated Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
        >
          {boss.name} SHATTERED
        </motion.h2>

        {/* Victory Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-300 sm:text-sm"
        >
          Your consistent daily discipline has broken the enemy&apos;s hold. You have
          conquered resistance and claimed the weekly crown.
        </motion.p>

        {/* +1,000 XP Reward Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring' }}
          className="mt-6 flex w-full items-center justify-between rounded-2xl border border-amber-300/30 bg-gradient-to-r from-amber-400/15 via-amber-400/10 to-amber-500/15 p-4 shadow-[0_0_30px_rgba(251,191,36,0.15)]"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/20 text-amber-300">
              <Zap size={20} />
            </span>
            <div className="text-left">
              <p className="label-caps text-[0.62rem] text-amber-200/80">BOUNTY REWARD</p>
              <p className="font-mono text-base font-bold text-white">+1,000 EXP POINTS</p>
            </div>
          </div>
          <span className="rounded-lg bg-emerald-400/20 border border-emerald-400/30 px-2.5 py-1 font-mono text-[0.68rem] font-bold text-emerald-200">
            CLAIMED
          </span>
        </motion.div>

        {/* System Message Component */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="mt-6 w-full text-left"
        >
          <SystemMessage
            eyebrow="RANKORA SYSTEM RECORD"
            title="WEEKLY BOSS VICTORY RECORDED"
            message="1,000 XP has been applied to your character profile. The Boss Slayer record has been updated in your achievements codex."
          />
        </motion.div>
      </div>
    </Modal>
  )
}

export default BossVictoryModal
