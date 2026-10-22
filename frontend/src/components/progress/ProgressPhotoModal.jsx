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
      title={initialPhoto ? 'Edit checkpoint' : 'Add progress photo'}
      eyebrow="System / Growth record"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>
            {initialPhoto ? 'Save changes' : 'Save checkpoint'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="text-sm leading-6 text-frost-400">
          Record a private checkpoint in your progression timeline.
        </p>
        {activePhoto ? (
          <div className="relative overflow-hidden rounded-xs border border-system-400/40 bg-void-950 shadow-[inset_0_0_24px_-8px_rgba(30,144,255,0.35)]">
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
              className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-xs border border-penalty-400/60 bg-void-950/90 px-2.5 py-1.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-penalty-200 transition-colors hover:bg-penalty-500/20"
            >
              <Trash2 size={13} />
              Remove
            </button>
          </div>
        ) : (
          <label
            htmlFor="progress-file"
            className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xs border border-dashed border-system-400/40 bg-system-500/5 px-4 text-center transition-[border-color,box-shadow] hover:border-system-400 hover:shadow-[inset_0_0_24px_-8px_rgba(30,144,255,0.45)]"
          >
            <span className="mb-3 grid h-11 w-11 place-items-center border border-system-400 bg-void-950 text-system-200 shadow-[0_0_14px_-2px_rgba(30,144,255,0.6)]">
              <ImagePlus size={20} />
            </span>
            <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-frost-50">
              Select progress photo
            </span>
            <span className="mt-1.5 font-mono text-xs text-frost-500">
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
            className="label-caps flex items-center gap-2 text-system-300 transition-colors hover:text-frost-50"
          >
            <RotateCcw size={13} />
            Change photo
          </button>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label-caps mb-1.5 block text-frost-400">Date</span>
            <input
              type="date"
              value={date}
              max={today}
              onChange={(event) => {
                setDate(event.target.value)
                setError('')
              }}
              className="field font-mono"
            />
          </label>
          <label className="block">
            <span className="label-caps mb-1.5 block text-frost-400">
              Weight <span className="text-frost-600">(optional)</span>
            </span>
            <input
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="e.g. 72 kg"
              className="field font-mono"
            />
          </label>
        </div>
        <label className="block">
          <span className="label-caps mb-1.5 block text-frost-400">
            Note <span className="text-frost-600">(optional)</span>
          </span>
          <textarea
            value={note}
            maxLength={500}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What changed since your last checkpoint?"
            rows={3}
            className="field resize-y leading-6"
          />
          <span className="mt-1 block text-right font-mono text-[0.65rem] text-frost-600">
            [{note.length}/500]
          </span>
        </label>
        {error && (
          <p className="flex items-start gap-2 border border-penalty-400/50 bg-penalty-500/10 px-3 py-2 text-xs text-penalty-200">
            <span className="font-display font-bold uppercase tracking-[0.14em] text-penalty-300">Error:</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    </Modal>
  )
}

export default ProgressPhotoModal
