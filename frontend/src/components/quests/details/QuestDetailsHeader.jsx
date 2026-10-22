import { AlertTriangle, ArrowLeft, Camera, Check, Clock, Swords, XCircle, Zap } from 'lucide-react'
import Badge from '../../common/Badge.jsx'
import Button from '../../common/Button.jsx'
import SystemWindow from '../../common/SystemWindow.jsx'
import { getQuestIcon } from '../../../data/mockQuests.js'

function QuestDetailsHeader({ quest, onBack, onAction, onFailure }) {
  const Icon = getQuestIcon(quest) || Swords
  const completed = quest.status === 'completed'
  const failed = quest.status === 'failed'
  const pendingVerification = quest.status === 'pending_verification'
  const skipped = quest.status === 'skipped'
  return (
    <div>
      <button
        type="button"
        onClick={() => onBack?.()}
        className="label-caps group mb-5 inline-flex items-center gap-2 text-frost-500 transition-colors hover:text-system-200"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        Back to daily quests
      </button>

      <SystemWindow
        title="Quest Info"
        align="center"
        icon={<span className="font-display text-sm font-bold">!</span>}
        className="[--panel-glow:rgba(30,144,255,0.26)]"
        bodyClassName="p-0"
      >
        <div className="px-5 py-7 text-center sm:px-10 sm:py-9">
          <span className="mx-auto grid h-14 w-14 place-items-center border border-system-400/70 bg-system-500/10 text-system-200 shadow-[0_0_18px_-4px_rgba(30,144,255,0.6),inset_0_0_12px_rgba(30,144,255,0.2)]">
            <Icon size={26} />
          </span>
          <p className="label-caps mt-5 text-system-300">
            {quest.category} <span className="text-frost-600">/</span> Mission briefing
          </p>
          <h1 className="sys-title mx-auto mt-3 max-w-3xl wrap-break-word text-3xl leading-tight sm:text-5xl">
            {quest.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-frost-300 sm:text-base sm:leading-7">
            {quest.shortDescription}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Badge tone={completed ? 'success' : failed ? 'danger' : pendingVerification ? 'difficulty' : skipped ? 'category' : 'status'}>
              {completed ? 'Completed' : failed ? 'Failed' : pendingVerification ? 'Pending Verification' : skipped ? 'Skipped' : quest.status}
            </Badge>
            <Badge tone="category">{quest.type} objective</Badge>
            <Badge tone="difficulty">{quest.difficulty}</Badge>
            {quest.verification !== 'None' && (
              <Badge tone="category">
                <Camera size={12} />
                {quest.verification}
              </Badge>
            )}
          </div>
          <p className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-frost-400">
            <Clock size={13} className="text-system-400" />
            {quest.estimatedTime}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-edge bg-void-950/40 px-5 py-5 sm:flex-row sm:justify-between sm:px-8">
          <div className="text-center sm:text-left">
            <p className="label-caps text-frost-500">Reward</p>
            <p className="mt-1 flex items-center justify-center gap-2 font-mono text-2xl font-bold text-gold-300 sys-glow sm:justify-start">
              <Zap size={20} className="text-gold-400" />+{quest.xp} EXP
            </p>
          </div>
          {completed ? (
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-clear-300">
              <Check size={16} />+{quest.xp} EXP EARNED
            </div>
          ) : pendingVerification ? (
            <Button variant="secondary" disabled className="w-full sm:w-auto">
              Verification in progress
            </Button>
          ) : failed ? (
            <div className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-penalty-300">
              <XCircle size={16} />
              Mission failed
            </div>
          ) : skipped ? (
            <Badge tone="category">Quest skipped</Badge>
          ) : (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button variant="primary" onClick={() => onAction?.()}>
                {quest.verification !== 'None' ? 'Proceed to verification' : 'Complete quest'}
              </Button>
              <Button variant="danger" onClick={() => onFailure?.()}>
                <AlertTriangle size={15} />
                Mark as failed
              </Button>
            </div>
          )}
        </div>

        {!completed && (
          <p className="flex items-center gap-2 border-t border-penalty-500/30 bg-penalty-500/5 px-5 py-3 text-xs text-penalty-200 sm:px-8">
            <AlertTriangle size={14} className="shrink-0 text-penalty-400" />
            <span>
              <span className="font-display font-bold uppercase tracking-[0.14em] text-penalty-300">Warning:</span> failed
              quests are permanently recorded in your failure history.
            </span>
          </p>
        )}
      </SystemWindow>
    </div>
  )
}
export default QuestDetailsHeader
