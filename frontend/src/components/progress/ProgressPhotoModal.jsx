import { motion } from 'framer-motion'
import { ImagePlus, RotateCcw, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import { getDayNumber, isFutureDate } from '../../utils/progressUtils.js'

function ProgressPhotoModal({ open, initialPhoto, journeyStart, onClose, onSave }) {
  const today = new Date().toISOString().slice(0, 10)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [base64, setBase64] = useState('')
  const [date, setDate] = useState(initialPhoto?.date?.slice(0, 10) || today)
  const [weight, setWeight] = useState(initialPhoto?.weight || '')
  const [note, setNote] = useState(initialPhoto?.note || '')
  const [error, setError] = useState('')

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
      setError('Use a JPG, PNG, or WEBP image.')
      return
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError('FILE SIZE EXCEEDED: Maximum allowed size is 10MB.')
      return
    }
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))

    const reader = new FileReader()
    reader.onload = () => {
      setBase64(reader.result)
    }
    reader.readAsDataURL(selected)
  }

  const removePhoto = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setFile(null)
    setPreviewUrl('')
    setBase64('')
  }

  const save = () => {
    if (isFutureDate(date)) {
      setError('The checkpoint date cannot be in the future.')
      return
    }
    const currentImg = base64 || previewUrl || initialPhoto?.photoUrl || initialPhoto?.previewUrl
    if (!initialPhoto && !currentImg) {
      setError('Select a progress photo before saving.')
      return
    }

    const saved = onSave({
      id: initialPhoto?.id || `progress-${Date.now()}`,
      date,
      dayNumber: getDayNumber(date, journeyStart),
      weight: weight.trim(),
      note: note.slice(0, 500),
      fileName: file?.name || initialPhoto?.fileName || 'checkpoint-photo',
      photoUrl: currentImg,
      previewUrl: currentImg,
      isOriginal: Boolean(initialPhoto?.isOriginal),
    })
    if (saved === false) setError('A checkpoint already exists for this date.')
  }

  const activePhoto = base64 || previewUrl || initialPhoto?.photoUrl || initialPhoto?.previewUrl

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialPhoto ? 'EDIT CHECKPOINT' : 'ADD PROGRESS PHOTO'}
      eyebrow="RANKORA SYSTEM"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            CANCEL
          </Button>
          <Button onClick={save}>
            {initialPhoto ? 'SAVE CHANGES' : 'SAVE CHECKPOINT'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="text-sm leading-6 text-slate-400">
          Record a private checkpoint in your progression timeline.
        </p>
        {activePhoto ? (
          <div className="relative overflow-hidden rounded-xl border border-cyan-300/20 bg-black/20">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={activePhoto}
              alt="Progress checkpoint preview"
              className="max-h-64 w-full object-contain"
            />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-lg bg-rankora-950/85 px-3 py-2 text-xs text-rose-200"
            >
              <Trash2 size={14} />
              REMOVE
            </button>
          </div>
        ) : (
          <label
            htmlFor="progress-file"
            className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-cyan-300/25 bg-cyan-300/[0.03] text-center transition hover:border-cyan-300/50"
          >
            <ImagePlus size={28} className="mb-3 text-cyan-200" />
            <span className="font-mono text-xs tracking-wider text-cyan-100">
              SELECT PROGRESS PHOTO
            </span>
            <span className="mt-2 text-xs text-slate-600">
              JPG, PNG, WEBP · max 10MB · private
            </span>
          </label>
        )}
        <input
          id="progress-file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={selectFile}
          className="sr-only"
          aria-label="Select progress photo"
        />
        {activePhoto && (
          <button
            type="button"
            onClick={() => document.getElementById('progress-file').click()}
            className="flex items-center gap-2 text-xs text-cyan-200 hover:text-white"
          >
            <RotateCcw size={13} />
            CHANGE PHOTO
          </button>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="label-caps text-slate-400">Date</span>
            <input
              type="date"
              value={date}
              max={today}
              onChange={(event) => {
                setDate(event.target.value)
                setError('')
              }}
              className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/4 px-3 text-sm text-white outline-none focus:border-cyan-300/50"
            />
          </label>
          <label>
            <span className="label-caps text-slate-400">
              Weight <span className="text-slate-600">(optional)</span>
            </span>
            <input
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="e.g. 72 kg"
              className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/4 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50"
            />
          </label>
        </div>
        <label>
          <span className="label-caps text-slate-400">
            Note <span className="text-slate-600">(optional)</span>
          </span>
          <textarea
            value={note}
            maxLength={500}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What changed since your last checkpoint?"
            rows={3}
            className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/4 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50"
          />
          <span className="mt-1 block text-right font-mono text-[0.65rem] text-slate-600">
            {note.length} / 500
          </span>
        </label>
        {error && <p className="text-xs text-rose-300">{error}</p>}
      </div>
    </Modal>
  )
}

export default ProgressPhotoModal
