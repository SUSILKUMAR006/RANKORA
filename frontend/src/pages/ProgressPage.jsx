import { ArrowLeftRight, Camera, Check, ChevronRight, Image as ImageIcon, Scale, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Modal from '../components/common/Modal.jsx'
import SectionHeader, { PageHeader } from '../components/common/SectionHeader.jsx'
import RankBadge from '../components/player/RankBadge.jsx'
import ProgressPhotoModal from '../components/progress/ProgressPhotoModal.jsx'
import ProgressTimeline from '../components/progress/ProgressTimeline.jsx'
import { fallbackPlayer } from '../data/mockDashboardData.js'
import { formatCheckpointDate, getDayNumber, getJourneyStart, getStoredProgressPhotos, saveProgressPhotos } from '../utils/progressUtils.js'
import { progressService } from '../services/progressService.js'
import { addNotification } from '../utils/notificationUtils.js'

function getPlayer() {
  try { return { ...fallbackPlayer, ...(JSON.parse(localStorage.getItem('rankora_player')) || {}) } } catch { return fallbackPlayer }
}

function ProgressPage() {
  const [player] = useState(getPlayer)
  const [photos, setPhotos] = useState(getStoredProgressPhotos)
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [compareIds, setCompareIds] = useState([])

  const fetchPhotos = async () => {
    const list = await progressService.getProgressPhotos()
    if (list) setPhotos(list)
  }

  useEffect(() => {
    fetchPhotos()
    window.addEventListener('storage', fetchPhotos)
  }, [])

  const journeyStart = getJourneyStart(player)
  const original = player.startingPhoto ? { id: 'awakening', date: journeyStart.slice(0, 10), dayNumber: 1, note: player.startingNote, weight: player.weight, fileName: 'awakening-photo', previewUrl: player.startingPhoto, isOriginal: true } : null
  const timeline = [...(original ? [original] : []), ...photos].sort((a, b) => new Date(b.date) - new Date(a.date))
  const weights = timeline.filter((photo) => photo.weight)
  const dayNumber = getDayNumber(new Date().toISOString().slice(0, 10), journeyStart)

  const savePhoto = async (photo) => {
    if (photos.some((item) => item.date === photo.date && item.id !== photo.id)) return false
    await progressService.uploadProgressPhoto(photo)
    await fetchPhotos()
    setEditing(null)
    setPhotoModalOpen(false)

    // Trigger Notification
    addNotification({
      type: 'progress_checkpoint',
      eventKey: `progress-photo-${photo.date}`,
      title: 'PROGRESS CHECKPOINT ADDED',
      message: `Day ${photo.dayNumber} photo recorded into your private timeline.`,
      tone: 'violet',
      iconName: 'Camera',
      link: '/progress',
    })

    return true
  }

  const deletePhoto = async () => {
    if (deleteTarget) {
      await progressService.deleteProgressPhoto(deleteTarget._id || deleteTarget.id)
      await fetchPhotos()
      setDeleteTarget(null)
    }
  }

  const comparison = compareIds.map((id) => timeline.find((photo) => photo.id === id)).filter(Boolean)
  const openNew = () => { setEditing(null); setPhotoModalOpen(true) }
  return (
    <div className="space-y-10 pb-10">
      <PageHeader
        eyebrow="Records / Private timeline"
        title={
          <>
            <span className="text-system-400">[</span> Growth Record <span className="text-system-400">]</span>
          </>
        }
        description="Document the evidence of your journey, one checkpoint at a time."
        actions={
          <Button onClick={openNew}>
            <Camera size={16} />
            Add progress photo
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <Card variant="highlighted">
          <p className="label-caps text-system-300">Journey day</p>
          <p className="mt-2 font-display text-4xl font-bold leading-none text-frost-50 sys-glow">
            <span className="text-xl text-system-300">DAY</span> {dayNumber}
          </p>
          <p className="mt-2 font-mono text-xs text-frost-500">Since {formatCheckpointDate(journeyStart.slice(0, 10))}</p>
        </Card>
        <Card>
          <p className="label-caps text-frost-500">Current status</p>
          <div className="mt-2 flex items-center gap-3">
            <RankBadge rank={player.rank} size="md" />
            <div>
              <p className="font-display text-2xl font-bold leading-none text-frost-50">
                <span className="text-sm text-frost-500">LVL</span> {player.level}
              </p>
              <p className="label-caps mt-1 text-frost-500">Rank {player.rank}</p>
            </div>
          </div>
        </Card>
        <Card>
          <p className="label-caps text-frost-500">Checkpoints</p>
          <p className="mt-2 font-display text-4xl font-bold leading-none text-frost-50">{timeline.length}</p>
          <p className="mt-2 font-mono text-xs text-frost-500">Private records</p>
        </Card>
      </section>

      {weights.length > 0 && (
        <Card className="flex flex-wrap items-center gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center border border-system-400 bg-void-950 text-system-200 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]">
            <Scale size={18} />
          </span>
          <div className="min-w-0">
            <p className="label-caps text-frost-500">Weight trend</p>
            <p className="mt-1 text-sm text-frost-300">
              Starting <span className="font-mono text-frost-50">{weights.at(-1).weight}</span>
              <span className="mx-3 font-mono text-frost-600">&rarr;</span>
              Latest <span className="font-mono text-system-200">{weights[0].weight}</span>
            </p>
          </div>
        </Card>
      )}

      {timeline.length === 0 ? (
        <Card className="grid min-h-80 place-items-center px-6 text-center">
          <div>
            <span className="mx-auto grid h-12 w-12 place-items-center border border-edge-strong bg-void-950 text-system-300">
              <ImageIcon size={22} />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold uppercase tracking-[0.14em] text-frost-50">Your timeline is waiting</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-frost-400">
              Add a private progress photo to make your first checkpoint visible.
            </p>
            <Button onClick={openNew} className="mt-6">
              <Camera size={16} />
              Add first checkpoint
            </Button>
          </div>
        </Card>
      ) : (
        <section>
          <SectionHeader
            eyebrow="Journey record"
            title="Timeline"
            actions={
              timeline.length >= 2 && (
                <Button variant="secondary" onClick={() => { setCompareIds([]); setCompareOpen(true) }}>
                  <ArrowLeftRight size={16} />
                  Compare progress
                </Button>
              )
            }
            className="mb-5"
          />
          <ProgressTimeline
            photos={timeline}
            onSelect={setSelected}
            onEdit={(photo) => { if (!photo.isOriginal) { setEditing(photo); setPhotoModalOpen(true) } }}
            onDelete={setDeleteTarget}
          />
        </section>
      )}

      <ProgressPhotoModal key={editing?.id || 'new'} open={photoModalOpen} initialPhoto={editing} journeyStart={journeyStart} onClose={() => { setPhotoModalOpen(false); setEditing(null) }} onSave={savePhoto} />

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.isOriginal ? 'AWAKENING CHECKPOINT' : `DAY ${selected?.dayNumber} CHECKPOINT`}
        eyebrow="Progress viewer"
        size="lg"
      >
        <div className="text-center">
          {selected?.photoUrl || selected?.previewUrl ? (
            <div className="rounded-xs border border-system-400/40 bg-void-950 p-1 shadow-[0_0_24px_-6px_rgba(30,144,255,0.5)]">
              <img src={selected.photoUrl || selected.previewUrl} alt="Selected progress checkpoint" className="mx-auto max-h-[65vh] w-full rounded-xs object-contain" />
            </div>
          ) : (
            <div className="sys-inset grid h-48 place-items-center text-frost-600">
              <ImageIcon size={22} />
            </div>
          )}
          {selected && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Badge tone="status">DAY {selected.dayNumber}</Badge>
              {selected.weight && <Badge tone="category">{selected.weight}</Badge>}
              <Badge tone="category">{formatCheckpointDate(selected.date)}</Badge>
            </div>
          )}
          {selected?.note && <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-frost-300">{selected.note}</p>}
        </div>
      </Modal>

      <Modal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        title="Compare progress"
        eyebrow="System / Growth record"
        size="lg"
        footer={<Button variant="ghost" onClick={() => setCompareOpen(false)}>Close</Button>}
      >
        <div className="space-y-5">
          <p className="text-sm text-frost-400">
            Select two checkpoints to view them side by side.{' '}
            <span className="font-mono text-frost-200">[{compareIds.length}/2]</span>
          </p>
          <div className="grid gap-2 min-[420px]:grid-cols-2">
            {timeline.map((photo) => (
              <button
                type="button"
                key={photo.id || photo._id}
                onClick={() => setCompareIds((current) => current.includes(photo.id || photo._id) ? current.filter((id) => id !== (photo.id || photo._id)) : current.length < 2 ? [...current, photo.id || photo._id] : [current[1], photo.id || photo._id])}
                className={`rounded-xs border p-3 text-left transition-[border-color,background-color,box-shadow] ${
                  compareIds.includes(photo.id || photo._id)
                    ? 'border-system-400 bg-system-500/15 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
                    : 'border-edge bg-void-950/60 hover:border-edge-strong'
                }`}
              >
                <span className="flex items-center justify-between font-mono text-xs font-bold text-frost-100">
                  DAY {photo.dayNumber}
                  {compareIds.includes(photo.id || photo._id) && <Check size={14} className="text-system-300" />}
                </span>
                <span className="mt-1 block font-mono text-xs text-frost-500">{formatCheckpointDate(photo.date)}</span>
              </button>
            ))}
          </div>
          {comparison.length === 2 ? (
            <div className="grid gap-3 min-[420px]:grid-cols-2">
              {comparison.map((photo) => (
                <div key={photo.id || photo._id} className="sys-inset overflow-hidden">
                  <div className="aspect-square bg-void-950">
                    {photo.photoUrl || photo.previewUrl ? (
                      <img src={photo.photoUrl || photo.previewUrl} alt={`Day ${photo.dayNumber} comparison`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-frost-600">
                        <ImageIcon size={22} />
                      </div>
                    )}
                  </div>
                  <p className="border-t border-edge px-3 py-2.5 font-mono text-xs text-system-200">
                    DAY {photo.dayNumber} · {photo.weight || 'Weight not recorded'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="label-caps flex items-center gap-2 text-frost-600">
              <ChevronRight size={14} />
              Choose two checkpoints above.
            </p>
          )}
        </div>
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete checkpoint?"
        eyebrow="Confirm action"
        tone="penalty"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={deletePhoto}>
              <Trash2 size={15} />
              Delete record
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-frost-300">
          This private checkpoint will be removed from your timeline. Your original Awakening record is always protected.
        </p>
      </Modal>
    </div>
  )
}
export default ProgressPage
