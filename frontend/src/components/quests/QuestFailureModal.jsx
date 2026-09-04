import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import Button from '../common/Button.jsx'
import FailureReasonSelector from './FailureReasonSelector.jsx'
import Modal from '../common/Modal.jsx'

function QuestFailureModal({ quest, open, processing, submitted = false, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const otherReason = reason === 'Other'
  const canSubmit = Boolean(reason) && (!otherReason || note.trim().length >= 5) && !processing
  const close = () => { setReason(''); setNote(''); setError(''); onClose() }
  const submit = () => {
    if (!reason) { setError('Select a reason before recording failure.'); return }
    if (otherReason && note.trim().length < 5) { setError('Tell the system what happened in at least 5 characters.'); return }
    onConfirm({ reason, note: note.trim() })
  }
  return <Modal open={open} onClose={processing ? undefined : close} title={submitted ? 'FAILURE RECORDED' : 'MISSION FAILED?'} eyebrow="RANKORA SYSTEM" footer={submitted ? <Button onClick={close}>CLOSE</Button> : <><Button variant="ghost" onClick={close} disabled={processing}>CANCEL</Button><Button variant="danger" onClick={submit} disabled={!canSubmit} loading={processing}>{processing ? 'RECORDING FAILURE...' : 'CONFIRM FAILURE'}</Button></>}><AnimatePresence mode="wait">{submitted ? <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center"><CheckCircle2 size={38} className="mx-auto mb-4 text-amber-200" /><p className="text-base text-slate-200">Your mission failure has been recorded.</p><div className="mt-5 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-sm"><div className="flex justify-between gap-3"><span className="text-slate-500">Quest</span><span className="text-right text-white">{quest.title}</span></div><div className="flex justify-between gap-3"><span className="text-slate-500">Reason</span><span className="text-amber-200">{reason}</span></div>{note && <div className="flex justify-between gap-3"><span className="text-slate-500">Note</span><span className="max-w-[65%] text-right text-slate-300">{note}</span></div>}</div><p className="mt-5 font-mono text-xs tracking-wider text-amber-200">FAILED · DATA RECORDED</p></motion.div> : <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><p className="text-sm leading-6 text-slate-300">Record what prevented you from completing this mission.</p><p className="mt-4 font-display text-sm text-white">{quest.title}</p><div className="mt-5"><FailureReasonSelector value={reason} onChange={(value) => { setReason(value); setError('') }} /></div>{otherReason && <label className="mt-5 block"><span className="label-caps text-slate-400">WHAT HAPPENED?</span><textarea value={note} onChange={(event) => { setNote(event.target.value.slice(0, 500)); setError('') }} placeholder="Tell the system what happened..." maxLength={500} rows="3" className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/4 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-amber-300/50" /><span className="mt-1 block text-right font-mono text-[0.65rem] text-slate-600">{note.length} / 500</span></label>}<label className="mt-5 block"><span className="label-caps text-slate-400">ADDITIONAL DETAILS <span className="text-slate-600">(optional)</span></span><textarea value={otherReason ? '' : note} onChange={(event) => { if (!otherReason) setNote(event.target.value.slice(0, 500)); setError('') }} placeholder="Add additional details (optional)..." maxLength={500} rows="2" disabled={otherReason} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/4 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-amber-300/50 disabled:opacity-40" /><span className="mt-1 block text-right font-mono text-[0.65rem] text-slate-600">{otherReason ? 0 : note.length} / 500</span></label>{error && <p className="mt-4 text-xs text-rose-300">{error}</p>}<p className="mt-5 text-xs text-slate-600">Failure is feedback, not a penalty. XP, stats, level, and rank remain unchanged.</p></motion.div>}</AnimatePresence></Modal>
}
export default QuestFailureModal
