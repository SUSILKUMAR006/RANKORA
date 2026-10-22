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
      tone="gold"
      size="sm"
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
      <p className="text-center text-sm text-frost-300">You are about to complete this mission.</p>
      <dl className="sys-inset mt-5 divide-y divide-edge/60 text-sm">
        <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
          <dt className="label-caps text-frost-500">Quest</dt>
          <dd className="text-right font-display font-bold uppercase tracking-[0.08em] text-frost-50">{quest.title}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
          <dt className="label-caps text-frost-500">Difficulty</dt>
          <dd className="label-caps text-gold-200">{quest.difficulty}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
          <dt className="label-caps text-frost-500">EXP reward</dt>
          <dd className="font-mono font-bold text-gold-300 sys-glow">+{quest.xp} EXP</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
          <dt className="label-caps text-frost-500">Stat reward</dt>
          <dd className="font-mono text-shadow-200">{formatStatReward(quest.statReward)}</dd>
        </div>
      </dl>
    </Modal>
  )
}

export default CompleteQuestModal
