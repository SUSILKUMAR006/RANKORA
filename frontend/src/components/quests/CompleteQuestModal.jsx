import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import { formatStatReward } from '../../utils/xpUtils.js'

function CompleteQuestModal({ quest, open, processing, onClose, onConfirm }) {
  if (!quest) return null

  const handleClose = () => {
    if (typeof onClose === 'function') onClose()
  }

  const handleConfirm = () => {
    if (typeof onConfirm === 'function') onConfirm()
  }

  return (
    <Modal
      open={open}
      onClose={processing ? undefined : handleClose}
      title="COMPLETE QUEST?"
      eyebrow="RANKORA SYSTEM"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={processing}>
            CANCEL
          </Button>
          <Button onClick={handleConfirm} loading={processing}>
            {processing ? 'PROCESSING MISSION...' : 'CONFIRM COMPLETION'}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-300">You are about to complete this mission.</p>
      <div className="mt-5 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Quest</span>
          <span className="text-right text-white font-semibold">{quest.title}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Difficulty</span>
          <span className="text-amber-200">{quest.difficulty}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">XP reward</span>
          <span className="font-mono text-cyan-200">+{quest.xp} XP</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Stat reward</span>
          <span className="font-mono text-violet-200">{formatStatReward(quest.statReward)}</span>
        </div>
      </div>
    </Modal>
  )
}

export default CompleteQuestModal
