import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Camera,
  CheckCircle2,
  Dumbbell,
  FileImage,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import { progressService } from '../../services/progressService.js'
import { normalizeVerificationType, verificationLabel } from '../../utils/verificationUtils.js'

function QuestVerificationModal({ quest, open, onClose, onVerified, onSubmitted }) {
  if (!quest) return null

  const type = normalizeVerificationType(quest.verification)
  const isGymQuest =
    quest.title?.toLowerCase().includes('gym') ||
    quest.category?.toLowerCase() === 'fitness'

  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [base64Data, setBase64Data] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const selectFile = (event) => {
    const selected = event.target.files?.[0]
    setError('')
    if (!selected) return

    if (!selected.type.startsWith('image/')) {
      setError('SYSTEM WARNING: Invalid file format. Please upload an image evidence.')
      return
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError('FILE SIZE EXCEEDED: Maximum allowed evidence size is 10MB.')
      return
    }

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }

    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))

    // Read to Base64 for persistent storage in Progress Photos
    const reader = new FileReader()
    reader.onload = () => {
      setBase64Data(reader.result)
    }
    reader.readAsDataURL(selected)
  }

  const removeFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setFile(null)
    setPreviewUrl('')
    setBase64Data('')
    setError('')
  }

  const canSubmit = Boolean(file) && !processing

  const handleSubmit = async () => {
    if (!file) {
      setError('VERIFICATION REQUIRED: You must upload a photo proof to complete this quest.')
      return
    }

    setProcessing(true)

    const photoUrl = base64Data || previewUrl

    // If this is a Gym workout, automatically save the proof to the Progress Photos timeline!
    if (isGymQuest && photoUrl) {
      try {
        await progressService.uploadProgressPhoto({
          photoUrl,
          note: note.trim() || 'Gym Workout Proof Checkpoint',
          date: new Date().toISOString().slice(0, 10),
          dayNumber: 1,
        })
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      if (onVerified) {
        onVerified({
          file,
          photoUrl,
          note: note.trim(),
          fileName: file.name,
        })
      } else if (onSubmitted) {
        onSubmitted({
          file,
          photoUrl,
          note: note.trim(),
          fileName: file.name,
        })
      }
      setProcessing(false)
      setSubmitted(true)
    }, 450)
  }

  return (
    <Modal
      open={open}
      onClose={processing ? undefined : onClose}
      title={submitted ? 'PROOF VERIFIED & COMPLETED' : 'PHOTO PROOF VERIFICATION'}
      eyebrow={isGymQuest ? 'GYM WORKOUT PROTOCOL' : 'RANKORA SYSTEM'}
      footer={
        submitted ? (
          <Button onClick={onClose} variant="primary">
            DISMISS
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose} disabled={processing}>
              CANCEL
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              loading={processing}
              variant="primary"
            >
              {processing ? 'VERIFYING EVIDENCE...' : 'CONFIRM & COMPLETE QUEST'}
            </Button>
          </>
        )
      }
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-2"
          >
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-emerald-400/40 bg-emerald-400/15 text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.3)]">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              WORKOUT EVIDENCE ACCEPTED
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Quest verified. +{quest.xp} XP and {quest.statReward || '+2 STR'} applied to your profile.
            </p>

            <div className="mt-5 space-y-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-xs font-mono">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Mission</span>
                <span className="text-right text-white font-bold">{quest.title}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Evidence Status</span>
                <span className="text-emerald-300 font-bold">Photo Inscribed</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Progress Timeline</span>
                <span className="text-cyan-300">Saved to /progress</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/5 p-3.5 flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
                <Dumbbell size={18} />
              </span>
              <div>
                <p className="font-display text-xs font-bold text-white">
                  MANDATORY WORKOUT EVIDENCE
                </p>
                <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">
                  To prevent false completion and maintain real discipline, upload a photo at the gym or workout session to complete this quest.
                </p>
              </div>
            </div>

            {previewUrl ? (
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-xl border border-cyan-300/30 bg-black/40 shadow-[0_0_20px_rgba(103,232,249,0.15)]">
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={previewUrl}
                    alt="Workout evidence proof"
                    className="max-h-72 w-full object-contain"
                  />
                  <button
                    type="button"
                    aria-label="Remove selected photo"
                    onClick={removeFile}
                    className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-rankora-950/85 px-3 py-1.5 font-mono text-xs text-rose-300 backdrop-blur hover:bg-rose-400/20 transition"
                  >
                    <Trash2 size={13} /> REMOVE
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 font-mono text-xs text-slate-400 px-1">
                  <span className="flex min-w-0 items-center gap-1.5 truncate">
                    <FileImage size={13} className="text-cyan-300" />
                    {file?.name}
                  </span>
                  <span>{(file?.size ? file.size / 1024 / 1024 : 0).toFixed(2)} MB</span>
                </div>
              </div>
            ) : (
              <label
                htmlFor="verification-file-input"
                className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-cyan-300/30 bg-cyan-300/[0.03] p-6 text-center transition hover:border-cyan-300/60 hover:bg-cyan-300/[0.06]"
              >
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-200">
                  <Camera size={24} />
                </div>
                <span className="font-mono text-xs font-bold tracking-wider text-cyan-100">
                  UPLOAD GYM PROOF PHOTO
                </span>
                <span className="mt-1.5 text-xs text-slate-400">
                  Click to select workout photo or capture snapshot
                </span>
                <span className="mt-1 font-mono text-[0.65rem] text-slate-500">
                  JPG, PNG, WEBP · Max 10MB
                </span>
              </label>
            )}

            <input
              id="verification-file-input"
              type="file"
              accept="image/*"
              onChange={selectFile}
              className="sr-only"
              aria-label="Upload gym evidence photo"
            />

            <label className="block">
              <span className="label-caps text-slate-400">
                WORKOUT NOTE <span className="text-slate-600">(optional)</span>
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Completed Push Day: 4x8 Bench Press, Shoulder Press..."
                rows={2}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white placeholder:text-slate-600 outline-none focus:border-cyan-300/50 focus:bg-white/[0.06]"
              />
            </label>

            {error && <p className="text-xs text-rose-300 font-mono">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}

export default QuestVerificationModal
