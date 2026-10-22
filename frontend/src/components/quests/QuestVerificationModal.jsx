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
    if (open) {
      setFile(null)
      setPreviewUrl('')
      setBase64Data('')
      setNote('')
      setError('')
      setProcessing(false)
      setSubmitted(false)
    }
  }, [open, quest?.id])

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
      if (typeof reader.result === 'string') {
        setBase64Data(reader.result)
      }
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
    setError('')

    let photoUrl = base64Data || previewUrl
    if (!base64Data && file) {
      try {
        photoUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      } catch {
        photoUrl = previewUrl
      }
    }

    // If this is a Gym workout or photo quest, automatically save proof to Progress Photos timeline
    if (photoUrl) {
      try {
        await progressService.uploadProgressPhoto({
          photoUrl,
          note: note.trim() || `${quest?.title || 'Gym Workout'} Evidence Checkpoint`,
          date: new Date().toISOString().slice(0, 10),
          dayNumber: 1,
        })
      } catch {
        // ignore
      }
    }

    const payload = {
      file,
      photoUrl,
      note: note.trim(),
      fileName: file?.name || 'workout-proof.jpg',
    }

    if (typeof onVerified === 'function') {
      onVerified(payload)
    } else if (typeof onSubmitted === 'function') {
      onSubmitted(payload)
    }

    setProcessing(false)
    setSubmitted(true)
  }

  const handleClose = () => {
    if (typeof onClose === 'function') onClose()
  }

  return (
    <Modal
      open={open}
      onClose={processing ? undefined : handleClose}
      title={submitted ? 'PROOF VERIFIED & COMPLETED' : 'PHOTO PROOF VERIFICATION'}
      eyebrow={isGymQuest ? 'GYM WORKOUT PROTOCOL' : 'RANKORA SYSTEM'}
      tone={submitted ? 'gold' : 'system'}
      footer={
        submitted ? (
          <Button onClick={handleClose} variant="primary">
            DISMISS
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={handleClose} disabled={processing}>
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
            className="py-2 text-center"
          >
            <span className="mx-auto mb-4 grid h-16 w-16 place-items-center border border-clear-400/70 bg-clear-500/10 text-clear-300 shadow-[0_0_24px_-2px_rgba(52,217,156,0.5)]">
              <CheckCircle2 size={34} />
            </span>
            <p className="label-caps text-clear-300">Quest clear</p>
            <h3 className="sys-title mt-1 text-lg">Workout evidence accepted</h3>
            <p className="mt-4 font-display text-4xl font-bold leading-none text-gold-300 sys-glow">
              +<span className="font-mono">{quest.xp}</span> EXP
            </p>
            <p className="mt-3 text-sm text-frost-300">
              Quest verified. +{quest.xp} XP and{' '}
              <span className="font-mono text-shadow-200">{quest.statReward || '+2 STR'}</span> applied to your profile.
            </p>

            <dl className="sys-inset mt-5 divide-y divide-edge/60 text-left text-xs">
              <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
                <dt className="label-caps text-frost-500">Mission</dt>
                <dd className="text-right font-display text-sm font-bold uppercase tracking-[0.08em] text-frost-50">{quest.title}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
                <dt className="label-caps text-frost-500">Evidence status</dt>
                <dd className="text-right font-mono font-bold text-clear-300">Photo Inscribed</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
                <dt className="label-caps text-frost-500">Progress timeline</dt>
                <dd className="text-right font-mono text-system-300">Saved to /progress</dd>
              </div>
            </dl>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="sys-inset flex items-start gap-3 p-3.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center border border-gold-400/60 bg-gold-500/10 text-gold-300">
                <Dumbbell size={17} />
              </span>
              <div className="min-w-0">
                <p className="label-caps flex items-center gap-2 text-gold-300">
                  <span className="h-1.5 w-1.5 rotate-45 animate-sys-pulse bg-gold-400 shadow-[0_0_8px_rgba(255,194,51,0.9)]" />
                  {processing ? 'Verifying' : 'Verification required'}
                </p>
                <p className="mt-1 font-display text-sm font-bold uppercase tracking-[0.08em] text-frost-50">
                  Mandatory workout evidence
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-frost-300">
                  To prevent false completion and maintain real discipline, upload a photo at the gym or workout session to complete this quest.
                </p>
              </div>
            </div>

            {previewUrl ? (
              <div className="space-y-3">
                <div className="relative overflow-hidden border border-system-400/50 bg-void-950 shadow-[0_0_20px_-4px_rgba(30,144,255,0.4)]">
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
                    className="absolute right-3 top-3 inline-flex items-center gap-1.5 border border-penalty-400/60 bg-void-950/85 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-penalty-300 backdrop-blur transition-colors hover:bg-penalty-500/20"
                  >
                    <Trash2 size={13} /> REMOVE
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 px-1 font-mono text-xs text-frost-400">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <FileImage size={13} className="shrink-0 text-system-300" />
                    <span className="truncate">{file?.name}</span>
                  </span>
                  <span className="shrink-0">{(file?.size ? file.size / 1024 / 1024 : 0).toFixed(2)} MB</span>
                </div>
              </div>
            ) : (
              <label
                htmlFor="verification-file-input"
                className="flex min-h-48 cursor-pointer flex-col items-center justify-center border border-dashed border-system-400/40 bg-system-500/5 p-6 text-center transition-colors hover:border-system-400/80 hover:bg-system-500/10"
              >
                <span className="mb-3 grid h-12 w-12 place-items-center border border-system-400/60 bg-system-500/10 text-system-200 shadow-[0_0_14px_-2px_rgba(30,144,255,0.5)]">
                  <Camera size={22} />
                </span>
                <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-frost-50">
                  Upload gym proof photo
                </span>
                <span className="mt-1.5 text-xs text-frost-400">
                  Click to select workout photo or capture snapshot
                </span>
                <span className="mt-1 font-mono text-[0.65rem] text-frost-500">
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
              <span className="label-caps mb-1.5 block text-frost-400">
                Workout note <span className="text-frost-600">(optional)</span>
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Completed Push Day: 4x8 Bench Press, Shoulder Press..."
                rows={2}
                className="field text-xs"
              />
            </label>

            {error && (
              <p className="border border-penalty-500/40 bg-penalty-500/10 px-3 py-2 font-mono text-xs text-penalty-200">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}

export default QuestVerificationModal
