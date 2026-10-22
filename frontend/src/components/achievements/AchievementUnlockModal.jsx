import { motion } from 'framer-motion'
import { Check, Sparkles, Trophy, Zap } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import SystemMessage from '../common/SystemMessage.jsx'

// Legendary titles glow gold; everything else glows Shadow-Monarch purple.
const toneStyles = {
  shadow: {
    frame: 'border-shadow-400 shadow-[0_0_24px_rgba(155,107,255,0.55)]',
    icon: 'border-shadow-300 bg-shadow-500/20 text-shadow-50 shadow-[0_0_36px_rgba(155,107,255,0.7),inset_0_0_16px_rgba(155,107,255,0.45)]',
    ring: 'border-shadow-400/70',
    burst: 'bg-shadow-500/25',
    rule: 'from-transparent via-shadow-400 to-transparent',
    title: '[text-shadow:0_0_16px_rgba(155,107,255,0.75)]',
    rarity: 'shadow',
  },
  gold: {
    frame: 'border-gold-400 shadow-[0_0_24px_rgba(255,194,51,0.5)]',
    icon: 'border-gold-300 bg-gold-500/20 text-gold-50 shadow-[0_0_36px_rgba(255,194,51,0.65),inset_0_0_16px_rgba(255,194,51,0.4)]',
    ring: 'border-gold-400/70',
    burst: 'bg-gold-500/20',
    rule: 'from-transparent via-gold-400 to-transparent',
    title: '[text-shadow:0_0_16px_rgba(255,194,51,0.7)]',
    rarity: 'difficulty',
  },
}

function AchievementUnlockModal({ achievement, onClose }) {
  if (!achievement) return null

  const handleClose = () => {
    if (typeof onClose === 'function') onClose()
  }

  const {
    name = 'Achievement Unlocked',
    description = 'You have accomplished a new milestone.',
    icon: Icon = Trophy,
    category = 'System',
    points = 100,
    rarity = 'Rare',
  } = achievement

  const tone = rarity === 'Legendary' ? 'gold' : 'shadow'
  const style = toneStyles[tone]

  return (
    <Modal
      open={Boolean(achievement)}
      onClose={handleClose}
      title="Title acquired"
      eyebrow="Notification"
      tone={tone}
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <span className="label-caps text-frost-500">Milestone recorded</span>
          <Button onClick={handleClose} className="min-w-32">
            <Check size={16} /> Claim &amp; continue
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        {/* Insignia: one-shot light burst + diamond frame + glowing icon box */}
        <div className="relative my-3 grid h-32 w-32 place-items-center">
          <motion.span
            aria-hidden="true"
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
            className={`absolute h-24 w-24 rotate-45 border ${style.ring}`}
          />
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
            className={`absolute h-28 w-28 blur-2xl ${style.burst}`}
          />
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 45 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className={`absolute h-22 w-22 border bg-void-950/60 ${style.frame}`}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20, delay: 0.3 }}
            className={`relative z-10 grid h-16 w-16 place-items-center border ${style.icon}`}
          >
            <Icon size={30} strokeWidth={2.2} />
          </motion.div>
        </div>

        {/* Header Badges */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-3 flex flex-wrap items-center justify-center gap-2"
        >
          <Badge tone={style.rarity}>
            <Sparkles size={11} /> {rarity}
          </Badge>
          <Badge tone="category">{category}</Badge>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`sys-title mt-3 text-2xl leading-tight sm:text-3xl ${style.title}`}
        >
          {name}
        </motion.h2>
        <span aria-hidden="true" className={`mt-3 h-px w-40 bg-linear-to-r ${style.rule}`} />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mx-auto mt-3 max-w-sm text-sm leading-6 text-frost-300"
        >
          {description}
        </motion.p>

        {/* Reward */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 inline-flex items-center gap-2 border border-gold-400/50 bg-gold-500/10 px-4 py-2 font-mono text-sm font-bold text-gold-300 shadow-[0_0_18px_-4px_rgba(255,194,51,0.5)]"
        >
          <Zap size={15} className="text-gold-400" />
          <span>+{points} Achievement Points (AP)</span>
        </motion.div>

        {/* System Message */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-6 w-full text-left"
        >
          <SystemMessage
            tone={tone}
            eyebrow="Codex record"
            title="Achievement unlocked & recorded"
            message="Your progression data has been permanently logged to system memory. New honors await."
          />
        </motion.div>
      </div>
    </Modal>
  )
}

export default AchievementUnlockModal
