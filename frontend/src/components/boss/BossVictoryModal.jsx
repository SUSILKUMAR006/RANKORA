import { motion } from 'framer-motion'
import { Check, Sparkles, Trophy, Zap } from 'lucide-react'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import SystemMessage from '../common/SystemMessage.jsx'

function BossVictoryModal({ open, boss, onClose }) {
  if (!boss) return null

  const handleClose = () => {
    if (typeof onClose === 'function') onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      tone="gold"
      title="Dungeon Cleared"
      eyebrow="Rankora legendary victory"
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <span className="label-caps text-gold-300/70">Bounty claimed</span>
          <Button onClick={handleClose} variant="gold" className="min-w-36">
            <Check size={16} /> Claim reward
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        {/* Victory crest */}
        <div className="relative my-4 grid h-28 w-28 place-items-center">
          <motion.span
            initial={{ scale: 0.4, opacity: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 45 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-1 border border-gold-400/40"
          />
          <motion.span
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ delay: 0.08, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-4 border border-gold-300 bg-gold-500/15 shadow-[0_0_36px_-4px_rgba(255,194,51,0.7),inset_0_0_18px_rgba(255,194,51,0.3)]"
          />
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.25 }}
            className="relative text-gold-200 drop-shadow-[0_0_10px_rgba(255,194,51,0.8)]"
          >
            <Trophy size={38} strokeWidth={2} />
          </motion.span>
        </div>

        {/* Victory badges */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-2 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="inline-flex items-center gap-1 rounded-xs border border-clear-400/50 bg-clear-500/10 px-2 py-0.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-clear-200">
            <Sparkles size={11} /> Weekly boss vanquished
          </span>
          <span className="rounded-xs border border-edge-strong bg-void-850 px-2 py-0.5 font-mono text-[0.68rem] text-frost-400">
            {boss.weekLabel}
          </span>
        </motion.div>

        {/* Boss defeated title */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="sys-title mt-4 text-2xl leading-tight [text-shadow:0_0_16px_rgba(255,194,51,0.55)] sm:text-3xl"
        >
          {boss.name} <span className="text-gold-300">shattered</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mx-auto mt-2 max-w-sm text-sm leading-6 text-frost-300"
        >
          Your consistent daily discipline has broken the enemy&apos;s hold. You have
          conquered resistance and claimed the weekly crown.
        </motion.p>

        {/* Reward */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0.3 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.34, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex w-full origin-top flex-wrap items-center justify-between gap-3 border border-gold-400/50 bg-gold-500/10 px-4 py-3 shadow-[0_0_24px_-8px_rgba(255,194,51,0.5),inset_0_0_20px_-10px_rgba(255,194,51,0.5)]"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center border border-gold-400/60 bg-gold-500/15 text-gold-300">
              <Zap size={20} />
            </span>
            <div className="text-left">
              <p className="label-caps text-gold-300/80">Bounty reward</p>
              <p className="font-mono text-base font-bold text-gold-200 sys-glow">+1,000 EXP points</p>
            </div>
          </div>
          <span className="rounded-xs border border-clear-400/50 bg-clear-500/10 px-2 py-0.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-clear-200">
            Claimed
          </span>
        </motion.div>

        {/* System record */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-5 w-full text-left"
        >
          <SystemMessage
            tone="gold"
            eyebrow="Rankora system record"
            title="Weekly boss victory recorded"
            message="1,000 XP has been applied to your character profile. The Boss Slayer record has been updated in your achievements codex."
          />
        </motion.div>
      </div>
    </Modal>
  )
}

export default BossVictoryModal
