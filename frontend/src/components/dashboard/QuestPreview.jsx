import { motion } from 'framer-motion'
import { AlertTriangle, Check, ChevronRight, Image, Swords, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../common/Badge.jsx'
import SystemWindow from '../common/SystemWindow.jsx'
import { getQuestIcon } from '../../data/mockQuests.js'

function QuestLine({ quest }) {
  const completed = quest.status === 'completed'
  const pendingVerification = quest.status === 'pending_verification'
  const failed = quest.status === 'failed'
  const Icon = getQuestIcon(quest) || Swords

  return (
    <Link
      to={`/quests/${quest.id}`}
      className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-system-500/5"
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center border ${
          completed
            ? 'border-clear-400/70 bg-clear-500/10 text-clear-300 shadow-[0_0_10px_rgba(52,217,156,0.35)]'
            : failed
            ? 'border-penalty-400/70 bg-penalty-500/10 text-penalty-300'
            : pendingVerification
            ? 'border-gold-400/60 bg-gold-500/10 text-gold-300'
            : 'border-edge-strong bg-void-950 text-system-300'
        }`}
      >
        {completed ? <Check size={16} /> : failed ? <X size={16} /> : <Icon size={16} />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3
            className={`font-display text-base font-bold uppercase tracking-[0.08em] transition-colors group-hover:text-system-200 ${
              completed || failed ? 'text-frost-500' : 'text-frost-50'
            } ${completed ? 'line-through decoration-clear-400/60' : ''}`}
          >
            {quest.title}
          </h3>
          <span className="label-caps text-frost-600">{quest.category}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-frost-500">
          <span className="line-clamp-1">{quest.description || quest.shortDescription}</span>
          {failed && <span className="font-mono text-penalty-300">Reason: {quest.failureReason || 'Recorded'}</span>}
          {quest.verification && quest.verification !== 'None' && (
            <span className="flex items-center gap-1 font-mono">
              <Image size={12} />
              {quest.verification}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="font-mono text-xs font-bold text-gold-300">+{quest.xp} EXP</span>
        {completed ? (
          <Badge tone="success">Clear</Badge>
        ) : failed ? (
          <Badge tone="danger">Failed</Badge>
        ) : pendingVerification ? (
          <Badge tone="difficulty">Verifying</Badge>
        ) : (
          <Badge tone="status">{quest.difficulty}</Badge>
        )}
      </div>
    </Link>
  )
}

function QuestPreview({ quests = [] }) {
  const cleared = quests.filter((quest) => quest.status === 'completed').length

  return (
    <SystemWindow
      title="Daily Quest"
      icon={<span className="font-display text-sm font-bold">!</span>}
      bodyClassName="p-0"
      actions={
        <Link to="/quests" className="label-caps inline-flex items-center gap-1 text-system-300 transition-colors hover:text-frost-50">
          All quests <ChevronRight size={14} />
        </Link>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge/70 px-5 py-3">
        <p className="label-caps text-frost-400">Goals</p>
        <p className="font-mono text-sm text-frost-200">
          [<span className="text-clear-300">{cleared}</span>/{quests.length}] cleared
        </p>
      </div>

      <div className="divide-y divide-edge/60">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id || index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <QuestLine quest={quest} />
          </motion.div>
        ))}
      </div>

      <p className="flex items-center gap-2 border-t border-penalty-500/30 bg-penalty-500/5 px-5 py-3 text-xs text-penalty-200">
        <AlertTriangle size={14} className="shrink-0 text-penalty-400" />
        <span>
          <span className="font-display font-bold uppercase tracking-[0.14em] text-penalty-300">Warning:</span> failed quests
          are permanently recorded in your failure history.
        </span>
      </p>
    </SystemWindow>
  )
}

export default QuestPreview
