import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import Button from '../common/Button.jsx'
import FailureReasonSelector from './FailureReasonSelector.jsx'
import Modal from '../common/Modal.jsx'

function QuestFailureModal({
  quest,
  open,
  processing = false,
  submitted = false,
  onClose,
  onConfirm,
  onRecorded,
}) {
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const otherReason = reason === 'Other'
  const canSubmit = Boolean(reason) && (!otherReason || note.trim().length >= 5) && !processing

  const close = () => {
    setReason('')
    setNote('')
    setError('')
    if (typeof onClose === 'function') onClose()
  }

  const submit = () => {
    if (!reason) {
      setError('Select a reason before recording failure.')
      return
    }
    if (otherReason && note.trim().length < 5) {
      setError('Tell the system what happened in at least 5 characters.')
      return
    }
    const payload = { reason, note: note.trim() }
    if (typeof onConfirm === 'function') {
      onConfirm(payload)
    } else if (typeof onRecorded === 'function') {
      onRecorded(payload)
    }
  }

  return (
    <Modal
      open={open}
      onClose={processing ? undefined : close}
      title={submitted ? 'FAILURE RECORDED' : 'MISSION FAILED?'}
      eyebrow="RANKORA SYSTEM"
      tone="penalty"
      footer={
        submitted ? (
          <Button onClick={close}>CLOSE</Button>
        ) : (
          <>
            <Button variant="ghost" onClick={close} disabled={processing}>
              CANCEL
            </Button>
            <Button
              variant="danger"
              onClick={submit}
              disabled={!canSubmit}
              loading={processing}
            >
              {processing ? 'RECORDING FAILURE...' : 'CONFIRM FAILURE'}
            </Button>
          </>
        )
      }
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center border border-penalty-400/70 bg-penalty-500/10 text-penalty-300 shadow-[0_0_18px_-2px_rgba(240,42,62,0.55)]">
              <CheckCircle2 size={30} />
            </span>
            <p className="text-base text-frost-200">Your mission failure has been recorded.</p>
            <dl className="sys-inset mt-5 divide-y divide-edge/60 text-left text-sm">
              <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
                <dt className="label-caps text-frost-500">Quest</dt>
                <dd className="text-right font-display font-bold uppercase tracking-[0.08em] text-frost-50">{quest?.title}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
                <dt className="label-caps text-frost-500">Reason</dt>
                <dd className="label-caps text-right text-penalty-300">{reason}</dd>
              </div>
              {note && (
                <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
                  <dt className="label-caps text-frost-500">Note</dt>
                  <dd className="max-w-[65%] break-words text-right text-frost-300">{note}</dd>
                </div>
              )}
            </dl>
            <p className="mt-5 font-mono text-xs tracking-wider text-penalty-300">
              [ FAILED · DATA RECORDED ]
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-sm leading-6 text-frost-300">
              Record what prevented you from completing this mission.
            </p>
            <div className="sys-inset mt-4 flex items-center gap-2.5 px-3 py-2.5">
              <span className="h-2 w-2 shrink-0 rotate-45 border border-penalty-400 bg-penalty-500/40" />
              <p className="min-w-0 font-display text-base font-bold uppercase tracking-[0.08em] text-frost-50">{quest?.title}</p>
            </div>
            <div className="mt-5">
              <FailureReasonSelector
                value={reason}
                onChange={(value) => {
                  setReason(value)
                  setError('')
                }}
              />
            </div>
            {otherReason && (
              <label className="mt-5 block">
                <span className="label-caps mb-1.5 block text-frost-400">What happened?</span>
                <textarea
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value.slice(0, 500))
                    setError('')
                  }}
                  placeholder="Tell the system what happened..."
                  maxLength={500}
                  rows="3"
                  className="field resize-y"
                />
                <span className="mt-1 block text-right font-mono text-[0.65rem] text-frost-600">
                  {note.length} / 500
                </span>
              </label>
            )}
            <label className="mt-5 block">
              <span className="label-caps mb-1.5 block text-frost-400">
                Additional details <span className="text-frost-600">(optional)</span>
              </span>
              <textarea
                value={otherReason ? '' : note}
                onChange={(event) => {
                  if (!otherReason) setNote(event.target.value.slice(0, 500))
                  setError('')
                }}
                placeholder="Add additional details (optional)..."
                maxLength={500}
                rows="2"
                disabled={otherReason}
                className="field resize-y disabled:opacity-40"
              />
              <span className="mt-1 block text-right font-mono text-[0.65rem] text-frost-600">
                {otherReason ? 0 : note.length} / 500
              </span>
            </label>
            {error && (
              <p className="mt-4 flex items-center gap-2 border border-penalty-500/40 bg-penalty-500/10 px-3 py-2 text-xs text-penalty-200">
                <AlertTriangle size={13} className="shrink-0 text-penalty-400" />
                {error}
              </p>
            )}
            <p className="-mx-6 -mb-5 mt-5 flex items-start gap-2 border-t border-penalty-500/30 bg-penalty-500/5 px-6 py-3 text-xs text-penalty-200">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-penalty-400" />
              <span>
                <span className="font-display font-bold uppercase tracking-[0.14em] text-penalty-300">Notice:</span> failure is
                feedback, not a penalty. XP, stats, level, and rank remain unchanged.
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}

export default QuestFailureModal
