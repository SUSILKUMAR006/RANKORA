import { Check, Clock, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from '../common/Card.jsx'
import { formatStatReward } from '../../utils/xpUtils.js'

function QuestCompletionSuccess({ quest, levelUp }) {
  const completedAt = quest.completedAt ? new Date(quest.completedAt) : new Date()
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card variant="standard" tone="clear">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center border border-clear-400/70 bg-clear-500/10 text-clear-300 shadow-[0_0_10px_rgba(52,217,156,0.35)]">
            <Check size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="label-caps text-clear-300">Quest clear</p>
            <h3 className="sys-title mt-1 text-base">Mission complete</h3>
            <p className="mt-1.5 text-sm text-frost-300">Rewards have been added to your profile.</p>
            <p className="mt-3 flex items-center gap-2 font-mono text-xs text-frost-500">
              <Clock size={13} />
              Completed {completedAt.toLocaleDateString()} at {completedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
              <span className="flex items-center gap-1.5 font-bold text-gold-300 sys-glow">
                <Zap size={14} />+{quest.xp} EXP EARNED
              </span>
              <span className="text-shadow-200">{formatStatReward(quest.statReward)}</span>
              {levelUp && (
                <span className="border border-gold-400/60 bg-gold-500/10 px-2 py-0.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-gold-200 sys-glow">
                  Level up!
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default QuestCompletionSuccess
