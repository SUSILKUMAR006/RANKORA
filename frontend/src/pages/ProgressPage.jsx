import { motion } from 'framer-motion'
import { ArrowLeftRight, Camera, Check, ChevronRight, Image as ImageIcon, Scale, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Modal from '../components/common/Modal.jsx'
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
  return <div className="space-y-10 pb-10">
    <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-5"><div><p className="label-caps text-cyan-300/70">RANKORA SYSTEM / PRIVATE TIMELINE</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white">PROGRESS PHOTOS</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Document the evidence of your journey, one checkpoint at a time.</p></div><Button onClick={openNew}><Camera size={16} />ADD PROGRESS PHOTO</Button></motion.header>
    <section className="grid gap-4 sm:grid-cols-3"><Card variant="highlighted"><p className="label-caps text-cyan-300/70">Journey day</p><p className="mt-3 font-mono text-3xl text-white">DAY {dayNumber}</p><p className="mt-2 text-xs text-slate-500">Since {formatCheckpointDate(journeyStart.slice(0, 10))}</p></Card><Card variant="glass"><p className="label-caps text-slate-500">Current status</p><div className="mt-3 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-400/10 text-violet-200"><Sparkles size={19} /></span><div><p className="font-mono text-xl text-white">LVL {player.level}</p><p className="text-xs text-slate-500">Rank {player.rank}</p></div></div></Card><Card variant="glass"><p className="label-caps text-slate-500">Checkpoints</p><p className="mt-3 font-mono text-3xl text-white">{timeline.length}</p><p className="mt-2 text-xs text-slate-500">Private records</p></Card></section>
    {weights.length > 0 && <Card variant="glass" className="flex flex-wrap items-center gap-5"><Scale className="text-cyan-200" size={22} /><div><p className="label-caps text-slate-500">Weight trend</p><p className="mt-1 text-sm text-slate-300">Starting <span className="font-mono text-white">{weights.at(-1).weight}</span><span className="mx-3 text-slate-700">to</span>Latest <span className="font-mono text-cyan-200">{weights[0].weight}</span></p></div></Card>}
    {timeline.length === 0 ? <Card variant="glass" className="grid min-h-80 place-items-center text-center"><ImageIcon size={32} className="text-slate-600" /><div><h2 className="mt-4 font-display text-xl font-semibold text-white">YOUR TIMELINE IS WAITING</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Add a private progress photo to make your first checkpoint visible.</p><Button onClick={openNew} className="mt-6"><Camera size={16} />ADD FIRST CHECKPOINT</Button></div></Card> : <section><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="label-caps text-cyan-300/70">Journey record</p><h2 className="mt-2 font-display text-2xl font-semibold text-white">TIMELINE</h2></div>{timeline.length >= 2 && <Button variant="secondary" onClick={() => { setCompareIds([]); setCompareOpen(true) }}><ArrowLeftRight size={16} />COMPARE PROGRESS</Button>}</div><ProgressTimeline photos={timeline} onSelect={setSelected} onEdit={(photo) => { if (!photo.isOriginal) { setEditing(photo); setPhotoModalOpen(true) } }} onDelete={setDeleteTarget} /></section>}
    <ProgressPhotoModal key={editing?.id || 'new'} open={photoModalOpen} initialPhoto={editing} journeyStart={journeyStart} onClose={() => { setPhotoModalOpen(false); setEditing(null) }} onSave={savePhoto} />
    <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.isOriginal ? 'AWAKENING CHECKPOINT' : `DAY ${selected?.dayNumber} CHECKPOINT`} eyebrow="PROGRESS VIEWER"><div className="text-center">{selected?.photoUrl || selected?.previewUrl ? <img src={selected.photoUrl || selected.previewUrl} alt="Selected progress checkpoint" className="mx-auto max-h-[65vh] w-full rounded-xl object-contain" /> : <div className="grid h-48 place-items-center rounded-xl bg-white/3 text-slate-600"><ImageIcon size={22} /></div>}{selected && <div className="mt-5 flex flex-wrap justify-center gap-3"><Badge tone="status">DAY {selected.dayNumber}</Badge>{selected.weight && <Badge tone="category">{selected.weight}</Badge>}<Badge tone="category">{formatCheckpointDate(selected.date)}</Badge></div>}{selected?.note && <p className="mt-4 text-sm leading-6 text-slate-400">{selected.note}</p>}</div></Modal>
    <Modal open={compareOpen} onClose={() => setCompareOpen(false)} title="COMPARE PROGRESS" eyebrow="RANKORA SYSTEM" footer={<Button variant="ghost" onClick={() => setCompareOpen(false)}>CLOSE</Button>}><div className="space-y-5"><p className="text-sm text-slate-400">Select two checkpoints to view them side by side.</p><div className="grid gap-2 sm:grid-cols-2">{timeline.map((photo) => <button type="button" key={photo.id || photo._id} onClick={() => setCompareIds((current) => current.includes(photo.id || photo._id) ? current.filter((id) => id !== (photo.id || photo._id)) : current.length < 2 ? [...current, photo.id || photo._id] : [current[1], photo.id || photo._id])} className={`rounded-xl border p-3 text-left transition ${compareIds.includes(photo.id || photo._id) ? 'border-cyan-300/50 bg-cyan-300/10' : 'border-white/10 bg-white/3'}`}><span className="flex items-center justify-between text-xs text-slate-300">DAY {photo.dayNumber}{compareIds.includes(photo.id || photo._id) && <Check size={14} className="text-cyan-200" />}</span><span className="mt-1 block text-xs text-slate-600">{formatCheckpointDate(photo.date)}</span></button>)}</div>{comparison.length === 2 ? <div className="grid gap-3 sm:grid-cols-2">{comparison.map((photo) => <div key={photo.id || photo._id} className="overflow-hidden rounded-xl border border-white/10"><div className="aspect-square bg-black/20">{photo.photoUrl || photo.previewUrl ? <img src={photo.photoUrl || photo.previewUrl} alt={`Day ${photo.dayNumber} comparison`} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-slate-600"><ImageIcon size={22} /></div>}</div><p className="p-3 font-mono text-xs text-cyan-200">DAY {photo.dayNumber} · {photo.weight || 'Weight not recorded'}</p></div>)}</div> : <p className="flex items-center gap-2 text-xs text-slate-600"><ChevronRight size={14} />Choose two checkpoints above.</p>}</div></Modal>
    <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="DELETE CHECKPOINT?" eyebrow="RANKORA SYSTEM" footer={<><Button variant="ghost" onClick={() => setDeleteTarget(null)}>CANCEL</Button><Button variant="danger" onClick={deletePhoto}><Trash2 size={15} />DELETE RECORD</Button></>}><p className="text-sm leading-6 text-slate-400">This private checkpoint will be removed from your timeline. Your original Awakening record is always protected.</p></Modal>
  </div>
}
export default ProgressPage
