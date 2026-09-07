import { motion } from 'framer-motion'
import { Check, ChevronRight, Image, Swords, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'
import { getQuestIcon } from '../../data/mockQuests.js'

function QuestPreviewCard({ quest, onAction }) {
  const completed = quest.status === 'completed'
  const pendingVerification = quest.status === 'pending_verification'
  const failed = quest.status === 'failed'
  const Icon = getQuestIcon(quest) || Swords

  return (
    <Card variant="interactive" className={completed || pendingVerification || failed ? 'opacity-65' : ''}>
      <div className="flex gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="label-caps text-slate-600">{quest.category}</p>
              <h3 className="mt-1 font-display font-semibold text-white">{quest.title}</h3>
            </div>
            <Badge tone={completed ? 'success' : failed ? 'danger' : pendingVerification ? 'difficulty' : 'difficulty'}>
              {completed ? 'Completed' : failed ? 'FAILED' : pendingVerification ? 'Pending Verification' : quest.difficulty}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-slate-400">{quest.description || quest.shortDescription}</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 font-mono text-xs text-amber-200">
              <Zap size={14} />+{quest.xp} XP
            </span>
            {failed && <span className="font-mono text-[0.62rem] text-amber-200">Reason: {quest.failureReason || 'Recorded'}</span>}
            {quest.verification && quest.verification !== 'None' && (
              <span className="flex items-center gap-1.5 font-mono text-[0.62rem] text-slate-500">
                <Image size={13} />{quest.verification}
              </span>
            )}
            <div className="flex items-center gap-2">
              <Link to={`/quests/${quest.id}`} className="text-xs text-cyan-200 hover:text-white">VIEW DETAILS</Link>
              <Button
                variant={completed ? 'success' : 'secondary'}
                disabled={completed || pendingVerification || failed}
                onClick={onAction}
              >
                {completed ? <><Check size={15} />COMPLETED</> : pendingVerification ? 'PENDING VERIFICATION' : failed ? 'FAILED' : 'COMPLETE'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function QuestPreview({ quests = [] }) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="label-caps text-cyan-300/70">Daily objectives</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white">TODAY'S QUESTS</h2>
        </div>
        <Link to="/quests" className="flex items-center gap-1 text-sm text-cyan-200 transition hover:text-white">
          VIEW ALL QUESTS <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id || index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * index }}
          >
            <QuestPreviewCard quest={quest} onAction={() => {}} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default QuestPreview

