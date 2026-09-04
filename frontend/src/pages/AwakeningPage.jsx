import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Dumbbell, HeartPulse, ImagePlus, Brain, BriefcaseBusiness, Scale, Sparkles, Trash2, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import RankBadge from '../components/player/RankBadge.jsx'
import { userService } from '../services/userService.js'
import { progressService } from '../services/progressService.js'

const STORAGE_KEY = 'rankora_player'
const avatars = [
  { id: 'solar', label: 'Solar', icon: Sparkles, className: 'text-amber-200 bg-amber-300/10 border-amber-300/25' },
  { id: 'forge', label: 'Forge', icon: Dumbbell, className: 'text-rose-200 bg-rose-300/10 border-rose-300/25' },
  { id: 'oracle', label: 'Oracle', icon: Brain, className: 'text-violet-200 bg-violet-300/10 border-violet-300/25' },
  { id: 'pulse', label: 'Pulse', icon: HeartPulse, className: 'text-cyan-200 bg-cyan-300/10 border-cyan-300/25' },
]
const paths = [
  { id: 'fitness', title: 'FITNESS', focus: 'Strength, health and physical performance.', icon: Dumbbell, tone: 'text-rose-200' },
  { id: 'knowledge', title: 'KNOWLEDGE', focus: 'Reading, learning and intelligence.', icon: Brain, tone: 'text-violet-200' },
  { id: 'discipline', title: 'DISCIPLINE', focus: 'Consistency, habits and self-control.', icon: Scale, tone: 'text-amber-200' },
  { id: 'career', title: 'CAREER', focus: 'Coding, work and professional growth.', icon: BriefcaseBusiness, tone: 'text-cyan-200' },
  { id: 'balanced', title: 'BALANCED', focus: 'Improve multiple areas equally.', icon: Sparkles, tone: 'text-emerald-200' },
]
const stepLabels = ['System Initialization', 'Player Identity', 'Primary Path', 'Starting Progress Photo', 'System Awakening']

const fadeVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.34, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
}

function AwakeningPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [step, setStep] = useState(1)
  const [identityError, setIdentityError] = useState('')
  const [pathError, setPathError] = useState('')
  const [status, setStatus] = useState('idle')
  const [form, setForm] = useState({ playerName: '', avatar: 'solar', age: '', height: '', weight: '', primaryPath: '', startingPhoto: '', startingNote: '' })

  useEffect(() => {
    try {
      if (JSON.parse(localStorage.getItem(STORAGE_KEY))?.onboardingCompleted) navigate('/dashboard', { replace: true })
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [navigate])

  const selectedPath = paths.find((path) => path.id === form.primaryPath)
  const selectedAvatar = avatars.find((avatar) => avatar.id === form.avatar) || avatars[0]
  const AvatarIcon = selectedAvatar.icon
  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const nextStep = () => {
    if (step === 2 && !form.playerName.trim()) { setIdentityError('Player name is required.'); return }
    if (step === 3 && !form.primaryPath) { setPathError('Select a primary path to continue.'); return }
    setStep((current) => Math.min(5, current + 1))
  }

  const handlePhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setForm((current) => ({ ...current, startingPhoto: reader.result }))
    reader.readAsDataURL(file)
  }

  const finishOnboarding = async () => {
    const player = {
      ...form,
      playerName: form.playerName.trim(),
      name: form.playerName.trim(),
      level: 1,
      xp: 0,
      rank: 'E',
      stats: { str: 5, vit: 5, int: 5, agi: 5, disc: 5 },
      currentStreak: 0,
      bestStreak: 0,
      onboardingCompleted: true,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player))
    window.dispatchEvent(new Event('rankora-player-updated'))

    try {
      await userService.updateProfile(player)
      if (form.startingPhoto) {
        await progressService.uploadProgressPhoto({
          dayNumber: 1,
          weight: form.weight || '',
          note: form.startingNote || 'Day 1 Awakening Photo',
          photoUrl: form.startingPhoto,
          isOriginal: true,
        })
      }
    } catch {
      // offline fallback
    }

    setStatus('online')
    window.setTimeout(() => navigate('/dashboard'), 650)
  }

  const stepContent = (() => {
    if (step === 1) return <InitializationStep onContinue={() => setStep(2)} />
    if (step === 2) return <IdentityStep form={form} updateField={(event) => { setIdentityError(''); updateField(event) }} error={identityError} onAvatar={(avatar) => setForm((current) => ({ ...current, avatar }))} />
    if (step === 3) return <PathStep selected={form.primaryPath} error={pathError} onSelect={(primaryPath) => { setPathError(''); setForm((current) => ({ ...current, primaryPath })) }} />
    if (step === 4) return <PhotoStep form={form} updateField={updateField} fileInputRef={fileInputRef} onPhoto={handlePhoto} onSkip={() => setStep(5)} onRemove={() => { setForm((current) => ({ ...current, startingPhoto: '' })); if (fileInputRef.current) fileInputRef.current.value = '' }} />
    return <AwakeningSummary form={form} selectedPath={selectedPath} AvatarIcon={AvatarIcon} status={status} onFinish={finishOnboarding} />
  })()

  return <div className="relative min-h-screen overflow-hidden bg-rankora-950 text-slate-100"><div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(103,232,249,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.05)_1px,transparent_1px)] bg-size-[52px_52px] opacity-50" /><div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" /><header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 lg:px-8"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300 text-rankora-950 shadow-[0_0_24px_rgba(103,232,249,0.35)]"><Sparkles size={18} strokeWidth={2.5} /></span><span className="font-display text-lg font-bold tracking-[0.16em]">RANKORA</span></div><span className="label-caps text-slate-600">{stepLabels[step - 1]}</span></header><main className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-3xl flex-col px-5 pb-10 pt-8 lg:px-8 lg:pt-12"><div className="mb-10 flex items-center justify-between"><div><p className="label-caps text-cyan-300/70">Player initialization</p><p className="mt-2 font-mono text-xs text-slate-500">{String(step).padStart(2, '0')} / 05</p></div><div className="flex gap-1.5" aria-label={`Step ${step} of 5`}>{stepLabels.map((label, index) => <span key={label} className={`h-1 w-8 rounded-full transition-colors sm:w-14 ${index + 1 <= step ? 'bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.45)]' : 'bg-white/10'}`} />)}</div></div><AnimatePresence mode="wait"><motion.div key={step} variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-1 flex-col">{stepContent}</motion.div></AnimatePresence>{step > 1 && step < 5 && <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5"><Button variant="ghost" onClick={() => setStep((current) => current - 1)}><ChevronLeft size={16} />Back</Button><Button onClick={nextStep}>{step === 2 ? 'CONFIRM IDENTITY' : step === 3 ? 'SELECT PATH' : 'CONTINUE'}<ChevronRight size={16} /></Button></div>}</main></div>
}

function InitializationStep({ onContinue }) {
  const messages = ['Scanning player profile...', 'Preparing progression system...', 'Initializing personal quests...']
  return <div className="flex flex-1 flex-col items-center justify-center text-center"><motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-8 grid h-24 w-24 place-items-center rounded-3xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-[0_0_60px_rgba(103,232,249,0.16)]"><Sparkles size={34} /></motion.div><p className="label-caps text-cyan-300/70">RANKORA SYSTEM</p><h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl">SYSTEM INITIALIZATION</h1><div className="mt-8 space-y-2 font-mono text-xs text-slate-500">{messages.map((message, index) => <motion.p key={message} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + index * 0.18 }}>{message}</motion.p>)}<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="pt-3 text-cyan-200">SYSTEM READY</motion.p></div><Button onClick={onContinue} className="mt-10 min-h-12 min-w-44">INITIALIZE<Zap size={16} /></Button></div>
}

function IdentityStep({ form, updateField, onAvatar, error }) {
  return <section className="mx-auto w-full max-w-2xl"><div className="mb-7"><p className="label-caps text-cyan-300/70">Step 02</p><h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">PLAYER IDENTITY</h1><p className="mt-3 text-slate-400">How should the system identify you?</p></div><Card variant="glass" className="space-y-6"><label className="block"><span className="label-caps text-slate-400">Player Name</span><input autoFocus name="playerName" value={form.playerName} onChange={updateField} placeholder="Choose your identity" className={`mt-2 min-h-12 w-full rounded-xl border bg-white/4 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:shadow-[0_0_22px_rgba(103,232,249,0.08)] ${error ? 'border-rose-300/50' : 'border-white/10'}`} />{error && <p className="mt-2 text-xs text-rose-300">{error}</p>}</label><div><p className="label-caps text-slate-400">Avatar</p><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{avatars.map(({ id, label, icon: Icon, className }) => <button type="button" key={id} onClick={() => onAvatar(id)} className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${form.avatar === id ? `${className} shadow-[0_0_24px_rgba(103,232,249,0.12)]` : 'border-white/10 bg-white/[0.03] text-slate-500 hover:border-white/20 hover:text-slate-200'}`}><Icon size={24} /><span className="text-xs">{label}</span>{form.avatar === id && <Check size={14} />}</button>)}</div></div><div><p className="label-caps text-slate-400">Optional information</p><div className="mt-3 grid gap-3 sm:grid-cols-3">{[['age', 'Age'], ['height', 'Height'], ['weight', 'Current Weight']].map(([name, label]) => <label key={name}><span className="text-xs text-slate-500">{label} <span className="text-slate-600">(optional)</span></span><input name={name} value={form[name]} onChange={updateField} inputMode="numeric" className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/4 px-3 text-sm text-white outline-none transition focus:border-cyan-300/50" /></label>)}</div></div></Card></section>
}

function PathStep({ selected, onSelect, error }) {
  return <section className="mx-auto w-full max-w-3xl"><div className="mb-7"><p className="label-caps text-cyan-300/70">Step 03</p><h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">CHOOSE YOUR PATH</h1><p className="mt-3 text-slate-400">What area of your life are you focusing on?</p></div><div className="grid gap-3 sm:grid-cols-2">{paths.map(({ id, title, focus, icon: Icon, tone }) => <motion.button type="button" key={id} onClick={() => onSelect(id)} whileTap={{ scale: 0.98 }} className={`relative flex items-start gap-4 rounded-2xl border p-5 text-left transition ${selected === id ? 'border-cyan-300/60 bg-cyan-300/10 shadow-[0_0_28px_rgba(103,232,249,0.12)]' : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]'} ${id === 'balanced' ? 'sm:col-span-2' : ''}`}><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.06] ${tone}`}><Icon size={20} /></span><span><span className="block font-mono text-sm tracking-wider text-white">{title}</span><span className="mt-2 block text-sm leading-6 text-slate-500">{focus}</span></span>{selected === id && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-cyan-300 text-rankora-950"><Check size={14} /></motion.span>}</motion.button>)}</div>{error && <p className="mt-3 text-xs text-rose-300">{error}</p>}</section>
}

function PhotoStep({ form, updateField, fileInputRef, onPhoto, onRemove, onSkip }) {
  return <section className="mx-auto w-full max-w-2xl"><div className="mb-7"><p className="label-caps text-cyan-300/70">Step 04</p><h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">RECORD YOUR STARTING POINT</h1><p className="mt-3 text-slate-400">Every transformation needs a beginning.</p></div><Card variant="glass" className="space-y-6"><p className="text-sm leading-6 text-slate-300">Your Day 1 photo becomes the first entry in your private progress timeline.</p>{form.startingPhoto ? <div className="relative overflow-hidden rounded-xl border border-cyan-300/25 bg-black/20"><motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={form.startingPhoto} alt="Starting progress preview" className="max-h-72 w-full object-contain" /><button type="button" onClick={onRemove} className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-lg bg-rankora-950/80 px-3 py-2 text-xs text-rose-200 backdrop-blur hover:bg-rose-400/20"><Trash2 size={14} />Remove photo</button></div> : <button type="button" onClick={() => fileInputRef.current?.click()} className="flex min-h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-cyan-300/25 bg-cyan-300/[0.03] text-center transition hover:border-cyan-300/50 hover:bg-cyan-300/[0.06]"><ImagePlus size={28} className="mb-3 text-cyan-200" /><span className="font-mono text-xs tracking-wider text-cyan-100">UPLOAD STARTING PHOTO</span><span className="mt-2 text-xs text-slate-600">Private by default · stored locally in this prototype</span></button>}<input ref={fileInputRef} type="file" accept="image/*" onChange={onPhoto} className="sr-only" aria-label="Upload starting photo" /><div className="grid gap-4 sm:grid-cols-2"><label><span className="label-caps text-slate-400">Starting weight <span className="text-slate-600">(optional)</span></span><input name="weight" value={form.weight} onChange={updateField} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/4 px-3 text-sm text-white outline-none focus:border-cyan-300/50" /></label><label className="sm:col-span-2"><span className="label-caps text-slate-400">Starting note <span className="text-slate-600">(optional)</span></span><textarea name="startingNote" value={form.startingNote} onChange={updateField} placeholder="Starting my RANKORA journey today." rows="3" className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/4 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50" /></label></div><button type="button" onClick={onSkip} className="text-sm text-slate-500 underline decoration-white/20 underline-offset-4 hover:text-cyan-200">Skip for now</button></Card></section>
}

function AwakeningSummary({ form, selectedPath, AvatarIcon, status, onFinish }) {
  return <section className="mx-auto w-full max-w-2xl text-center"><motion.div initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-3xl border border-cyan-300/40 bg-cyan-300/10 text-cyan-200 shadow-[0_0_55px_rgba(103,232,249,0.2)]"><Sparkles size={30} /></motion.div><p className="label-caps text-cyan-300/70">RANKORA SYSTEM</p><h1 className="mt-4 font-display text-3xl font-semibold text-white sm:text-5xl">PLAYER INITIALIZATION COMPLETE</h1><p className="mt-3 text-slate-400">Your personal progression system is ready.</p><Card variant="highlighted" className="mt-8 text-left"><div className="flex items-center gap-4 border-b border-white/10 pb-5"><span className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200"><AvatarIcon size={25} /></span><div><p className="label-caps text-slate-500">Player identity</p><p className="mt-1 font-display text-xl font-semibold text-white">{form.playerName || 'Player'}</p></div><Badge tone="category" className="ml-auto">{selectedPath?.title || 'Balanced'}</Badge></div><div className="mt-6 grid grid-cols-3 gap-3 text-center"><div><p className="label-caps text-slate-600">Level</p><p className="mt-2 font-mono text-2xl text-white">1</p></div><div><p className="label-caps text-slate-600">Rank</p><div className="mt-2 flex justify-center"><RankBadge rank="E" size="sm" /></div></div><div><p className="label-caps text-slate-600">XP</p><p className="mt-2 font-mono text-lg text-cyan-200">0 / 100</p></div></div><ProgressBar value={0} max={100} label="Initial XP" className="mt-6" /><div className="mt-6 grid grid-cols-5 gap-2 border-t border-white/10 pt-5">{Object.entries({ STR: 0, VIT: 0, INT: 0, AGI: 0, DISC: 0 }).map(([stat, value]) => <div key={stat} className="text-center"><p className="label-caps text-[0.58rem] text-slate-600">{stat}</p><p className="mt-1 font-mono text-lg text-white">{value}</p></div>)}</div></Card><AnimatePresence mode="wait"><motion.p key={status} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8 font-mono text-sm tracking-wider text-cyan-200">{status === 'online' ? 'SYSTEM ONLINE' : 'YOUR JOURNEY BEGINS NOW.'}</motion.p></AnimatePresence>{status !== 'online' && <Button onClick={onFinish} className="mt-6 min-h-12 min-w-52">ENTER RANKORA<ChevronRight size={16} /></Button>}{status === 'online' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex items-center justify-center gap-2 text-sm text-emerald-200"><Check size={16} />Progression record saved</motion.div>}</section>
}

export default AwakeningPage
