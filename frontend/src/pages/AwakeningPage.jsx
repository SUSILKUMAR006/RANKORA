import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Dumbbell, HeartPulse, ImagePlus, Brain, BriefcaseBusiness, Scale, Sparkles, Trash2, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import RankBadge from '../components/player/RankBadge.jsx'
import { userService } from '../services/userService.js'
import { progressService } from '../services/progressService.js'

const STORAGE_KEY = 'rankora_player'
const avatars = [
  { id: 'solar', label: 'Solar', icon: Sparkles, className: 'text-gold-200 bg-gold-500/10 border-gold-400/70 shadow-[0_0_16px_-4px_rgba(255,194,51,0.6)]' },
  { id: 'forge', label: 'Forge', icon: Dumbbell, className: 'text-penalty-200 bg-penalty-500/10 border-penalty-400/70 shadow-[0_0_16px_-4px_rgba(240,42,62,0.6)]' },
  { id: 'oracle', label: 'Oracle', icon: Brain, className: 'text-shadow-200 bg-shadow-500/10 border-shadow-400/70 shadow-[0_0_16px_-4px_rgba(155,107,255,0.6)]' },
  { id: 'pulse', label: 'Pulse', icon: HeartPulse, className: 'text-system-200 bg-system-500/10 border-system-400 shadow-[0_0_16px_-4px_rgba(30,144,255,0.6)]' },
]
const paths = [
  { id: 'fitness', title: 'FITNESS', focus: 'Strength, health and physical performance.', icon: Dumbbell, tone: 'text-penalty-300' },
  { id: 'knowledge', title: 'KNOWLEDGE', focus: 'Reading, learning and intelligence.', icon: Brain, tone: 'text-shadow-300' },
  { id: 'discipline', title: 'DISCIPLINE', focus: 'Consistency, habits and self-control.', icon: Scale, tone: 'text-gold-300' },
  { id: 'career', title: 'CAREER', focus: 'Coding, work and professional growth.', icon: BriefcaseBusiness, tone: 'text-system-300' },
  { id: 'balanced', title: 'BALANCED', focus: 'Improve multiple areas equally.', icon: Sparkles, tone: 'text-clear-300' },
]
const stepLabels = ['System Initialization', 'Player Identity', 'Primary Path', 'Starting Progress Photo', 'System Awakening']

// Each step is a System pop-up: it unfolds from a thin line of light and folds back on exit.
const fadeVariants = {
  initial: { opacity: 0, scaleY: 0.03, scaleX: 0.7 },
  animate: {
    opacity: 1,
    scaleY: 1,
    scaleX: 1,
    transition: { scaleX: { duration: 0.18 }, scaleY: { delay: 0.14, duration: 0.32, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.12 } },
  },
  exit: { opacity: 0, scaleY: 0.03, transition: { duration: 0.18, ease: 'easeIn' } },
}

const labelClass = 'label-caps mb-1.5 block text-frost-400'

// Lines that rise in one after another inside a pop-up.
function Reveal({ delay = 0, className = '', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.36 + delay, duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// The pop-up window itself: "[!] NOTIFICATION" eyebrow, glowing caps title, optional description.
function SystemPopup({ eyebrow = 'Notification', title, description, tone = 'system', children, className = '' }) {
  const toneClass = tone === 'gold' ? 'tone-gold' : ''
  const boxTone = tone === 'gold' ? 'border-gold-400 text-gold-200' : 'border-system-400 text-system-200'
  return (
    <div className={`sys-panel w-full ${toneClass} [--panel-glow:rgba(30,144,255,0.32)] ${className}`}>
      <header className="border-b border-(--panel-edge,var(--color-edge)) px-5 py-5 text-center sm:px-8">
        <p className="label-caps inline-flex items-center gap-2.5 text-(--panel-accent,var(--color-system-300))">
          <span className={`grid h-6 w-6 place-items-center border font-display text-sm font-bold shadow-[0_0_12px_-2px_currentColor] ${boxTone}`}>!</span>
          {eyebrow}
        </p>
        {title && <h1 className="sys-title mt-3 text-2xl leading-tight sm:text-4xl">{title}</h1>}
        {description && <p className="mt-2 text-sm text-frost-400 sm:text-base">{description}</p>}
      </header>
      <div className="p-5 sm:p-8">{children}</div>
    </div>
  )
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

  return (
    <div className="relative min-h-screen overflow-hidden text-frost-200">
      {/* Faint System grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(74,174,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(74,174,255,0.045)_1px,transparent_1px)] bg-size-[52px_52px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      {/* Gate glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-system-500/10 blur-[120px]" />
      {/* Moving scan line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 animate-sys-scan bg-linear-to-b from-transparent via-system-400/[0.04] to-transparent" />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="relative grid h-9 w-9 place-items-center">
            <span className="absolute inset-0 rotate-45 border border-system-400 bg-system-500/15 shadow-[0_0_16px_rgba(30,144,255,0.5)]" />
            <span className="relative font-display text-lg font-bold text-frost-50 sys-glow">R</span>
          </span>
          <span className="sys-title text-xl tracking-[0.28em]">Rankora</span>
        </div>
        <span className="label-caps hidden text-right text-frost-600 min-[420px]:inline">{stepLabels[step - 1]}</span>
      </header>

      <main className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-3xl flex-col px-4 pb-10 pt-4 sm:px-5 lg:px-8 lg:pt-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="label-caps flex items-center gap-2 text-system-300">
              <span className="h-1.5 w-1.5 rotate-45 bg-system-400 shadow-[0_0_8px_rgba(74,174,255,0.9)]" />
              Player initialization
            </p>
            <p className="mt-1.5 font-mono text-xs text-frost-500">
              <span className="text-frost-100">{String(step).padStart(2, '0')}</span> / 05
            </p>
          </div>
          <div className="flex gap-1" aria-label={`Step ${step} of 5`}>
            {stepLabels.map((label, index) => (
              <span
                key={label}
                title={label}
                className={`h-1.5 w-7 border transition-[background-color,border-color,box-shadow] duration-300 sm:w-14 ${
                  index + 1 <= step
                    ? 'border-system-400 bg-system-400 shadow-[0_0_10px_rgba(74,174,255,0.8)]'
                    : 'border-edge bg-void-900'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="flex flex-1 flex-col">
            {stepContent}
          </motion.div>
        </AnimatePresence>

        {step > 1 && step < 5 && (
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-edge pt-5">
            <Button variant="ghost" onClick={() => setStep((current) => current - 1)}>
              <ChevronLeft size={16} />
              Back
            </Button>
            <Button onClick={nextStep}>
              {step === 2 ? 'CONFIRM IDENTITY' : step === 3 ? 'SELECT PATH' : 'CONTINUE'}
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

function InitializationStep({ onContinue }) {
  const messages = ['Scanning player profile...', 'Preparing progression system...', 'Initializing personal quests...']
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <SystemPopup eyebrow="Notification" className="max-w-2xl">
        <div className="text-center">
          <div className="sys-inset mx-auto max-w-sm space-y-1.5 px-4 py-3 text-left font-mono text-xs text-frost-500">
            {messages.map((message, index) => (
              <motion.p
                key={message}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + index * 0.18 }}
                className="flex items-center gap-2"
              >
                <span className="text-system-400">&gt;</span> {message}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
              className="flex items-center gap-2 pt-1 text-system-200 sys-glow"
            >
              <span className="h-1.5 w-1.5 animate-sys-pulse bg-system-300" /> SYSTEM READY
            </motion.p>
          </div>

          <Reveal delay={0.85}>
            <p className="label-caps mt-8 text-frost-600">Rankora System · System initialization</p>
          </Reveal>
          <Reveal delay={0.95}>
            <h1 className="sys-title mt-3 text-2xl leading-[1.08] sm:text-4xl">
              You have acquired the qualifications
              <br className="hidden sm:block" /> to be a <span className="text-system-300">Player</span>.
            </h1>
          </Reveal>
          <Reveal delay={1.15}>
            <p className="sys-title mt-5 text-lg text-system-200 sm:text-2xl">Will you accept?</p>
          </Reveal>
          <Reveal delay={1.3} className="mt-8 flex justify-center">
            <Button onClick={onContinue} className="min-h-12 w-full max-w-xs text-base tracking-[0.24em] sm:w-auto sm:min-w-52">
              Accept
              <Zap size={16} />
            </Button>
          </Reveal>
        </div>
      </SystemPopup>
    </div>
  )
}

function IdentityStep({ form, updateField, onAvatar, error }) {
  return (
    <section className="mx-auto w-full max-w-2xl">
      <SystemPopup eyebrow="Step 02 · Notification" title="Player Identity" description="How should the system identify you?">
        <div className="space-y-6">
          <label className="block">
            <span className={`label-caps mb-1.5 block ${error ? 'text-penalty-300' : 'text-frost-400'}`}>Player Name</span>
            <input
              autoFocus
              name="playerName"
              value={form.playerName}
              onChange={updateField}
              placeholder="Choose your identity"
              className={`field min-h-12 font-display text-lg font-bold uppercase tracking-[0.08em] ${error ? 'border-penalty-400/70!' : ''}`}
            />
            {error && (
              <p className="mt-1.5 font-mono text-xs text-penalty-300">
                <span className="font-display font-bold">[!]</span> {error}
              </p>
            )}
          </label>

          <div>
            <p className={labelClass}>Avatar</p>
            <div className="mt-1 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {avatars.map(({ id, label, icon: Icon, className }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => onAvatar(id)}
                  aria-pressed={form.avatar === id}
                  className={`relative flex flex-col items-center gap-2 rounded-xs border p-4 transition-[border-color,background-color,box-shadow,color] duration-150 ${
                    form.avatar === id ? className : 'border-edge bg-void-950/50 text-frost-500 hover:border-edge-strong hover:text-frost-200'
                  }`}
                >
                  <Icon size={24} />
                  <span className="font-display text-xs font-bold uppercase tracking-[0.14em]">{label}</span>
                  {form.avatar === id && (
                    <span className="absolute right-1.5 top-1.5">
                      <Check size={13} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={labelClass}>Optional information</p>
            <div className="mt-1 grid gap-3 sm:grid-cols-3">
              {[['age', 'Age'], ['height', 'Height'], ['weight', 'Current Weight']].map(([name, label]) => (
                <label key={name} className="block">
                  <span className="mb-1 block text-xs text-frost-500">
                    {label} <span className="text-frost-600">(optional)</span>
                  </span>
                  <input name={name} value={form[name]} onChange={updateField} inputMode="numeric" className="field min-h-11 font-mono" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </SystemPopup>
    </section>
  )
}

function PathStep({ selected, onSelect, error }) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <SystemPopup eyebrow="Step 03 · Quest info" title="Choose Your Path" description="What area of your life are you focusing on?">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {paths.map(({ id, title, focus, icon: Icon, tone }, index) => (
            <motion.button
              type="button"
              key={id}
              onClick={() => onSelect(id)}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.4 + index * 0.05, duration: 0.22 } }}
              aria-pressed={selected === id}
              className={`relative flex items-start gap-4 rounded-xs border p-4 text-left transition-[border-color,background-color,box-shadow] duration-150 sm:p-5 ${
                selected === id
                  ? 'border-system-400 bg-system-500/15 shadow-[0_0_18px_-4px_rgba(30,144,255,0.7),inset_0_0_16px_-8px_rgba(30,144,255,0.5)]'
                  : 'border-edge bg-void-950/50 hover:border-edge-strong hover:bg-void-850'
              } ${id === 'balanced' ? 'sm:col-span-2' : ''}`}
            >
              <span className={`grid h-11 w-11 shrink-0 place-items-center border border-edge bg-void-900 ${tone}`}>
                <Icon size={20} />
              </span>
              <span className="min-w-0 pr-6">
                <span className="block font-display text-base font-bold tracking-[0.14em] text-frost-50">{title}</span>
                <span className="mt-1 block text-sm leading-6 text-frost-400">{focus}</span>
              </span>
              {selected === id && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-3 grid h-6 w-6 place-items-center border border-system-400 bg-system-500/30 text-frost-50 shadow-[0_0_10px_rgba(30,144,255,0.7)]"
                >
                  <Check size={14} />
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
        {error && (
          <p className="mt-3 font-mono text-xs text-penalty-300">
            <span className="font-display font-bold">[!]</span> {error}
          </p>
        )}
      </SystemPopup>
    </section>
  )
}

function PhotoStep({ form, updateField, fileInputRef, onPhoto, onRemove, onSkip }) {
  return (
    <section className="mx-auto w-full max-w-2xl">
      <SystemPopup eyebrow="Step 04 · Notification" title="Record Your Starting Point" description="Every transformation needs a beginning.">
        <div className="space-y-6">
          <p className="text-sm leading-6 text-frost-300">Your Day 1 photo becomes the first entry in your private progress timeline.</p>
          {form.startingPhoto ? (
            <div className="sys-inset relative overflow-hidden border-system-400/50">
              <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={form.startingPhoto} alt="Starting progress preview" className="max-h-72 w-full object-contain" />
              <button
                type="button"
                onClick={onRemove}
                className="absolute right-3 top-3 inline-flex items-center gap-2 border border-penalty-400/60 bg-void-950/85 px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.12em] text-penalty-200 backdrop-blur transition-colors hover:bg-penalty-500/20"
              >
                <Trash2 size={14} />
                Remove photo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group flex min-h-44 w-full flex-col items-center justify-center rounded-xs border border-dashed border-system-400/40 bg-system-500/5 px-4 text-center transition-[border-color,background-color,box-shadow] hover:border-system-400 hover:bg-system-500/10 hover:shadow-[inset_0_0_24px_-8px_rgba(30,144,255,0.5)]"
            >
              <span className="mb-3 grid h-12 w-12 place-items-center border border-system-400/70 text-system-200 transition-shadow group-hover:shadow-[0_0_14px_rgba(30,144,255,0.6)]">
                <ImagePlus size={22} />
              </span>
              <span className="font-display text-sm font-bold uppercase tracking-[0.16em] text-frost-50">Upload starting photo</span>
              <span className="mt-2 font-mono text-xs text-frost-600">Private by default · stored locally in this prototype</span>
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={onPhoto} className="sr-only" aria-label="Upload starting photo" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>
                Starting weight <span className="text-frost-600">(optional)</span>
              </span>
              <input name="weight" value={form.weight} onChange={updateField} className="field min-h-11 font-mono" />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>
                Starting note <span className="text-frost-600">(optional)</span>
              </span>
              <textarea
                name="startingNote"
                value={form.startingNote}
                onChange={updateField}
                placeholder="Starting my RANKORA journey today."
                rows="3"
                className="field resize-none"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="label-caps text-frost-500 underline decoration-edge-strong underline-offset-4 transition-colors hover:text-system-200"
          >
            Skip for now
          </button>
        </div>
      </SystemPopup>
    </section>
  )
}

function AwakeningSummary({ form, selectedPath, AvatarIcon, status, onFinish }) {
  return (
    <section className="mx-auto w-full max-w-2xl text-center">
      <SystemPopup eyebrow="Rankora System · Notification" title="Player Initialization Complete" description="Your personal progression system is ready.">
        <div className="text-left">
          {/* Status window */}
          <div className="sys-inset">
            <p className="border-b border-edge/70 py-2 text-center font-display text-sm font-bold uppercase tracking-[0.14em] text-frost-50">
              <span className="text-system-400">[</span> Status <span className="text-system-400">]</span>
            </p>
            <div className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-4 border-b border-edge/60 pb-5">
                <span className="grid h-14 w-14 shrink-0 place-items-center border border-system-400/70 bg-system-500/10 text-system-200 shadow-[0_0_14px_-2px_rgba(30,144,255,0.5)]">
                  <AvatarIcon size={25} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="label-caps text-frost-500">Player identity</p>
                  <p className="mt-1 truncate font-display text-xl font-bold uppercase tracking-[0.08em] text-frost-50">{form.playerName || 'Player'}</p>
                </div>
                <Badge tone="status">{selectedPath?.title || 'Balanced'}</Badge>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center sm:gap-3">
                <div className="sys-inset px-1 py-3">
                  <p className="label-caps text-frost-500">Level</p>
                  <p className="mt-1 font-display text-3xl font-bold leading-none text-frost-50 sys-glow">1</p>
                </div>
                <div className="sys-inset px-1 py-3">
                  <p className="label-caps text-frost-500">Rank</p>
                  <div className="mt-1 flex justify-center">
                    <RankBadge rank="E" size="sm" />
                  </div>
                </div>
                <div className="sys-inset px-1 py-3">
                  <p className="label-caps text-frost-500">XP</p>
                  <p className="mt-2 font-mono text-sm text-system-200 sm:text-base">0 / 100</p>
                </div>
              </div>

              <ProgressBar value={0} max={100} label="Initial XP" className="mt-5" />

              <div className="mt-5 grid grid-cols-5 gap-1.5 border-t border-edge/60 pt-5 sm:gap-2">
                {Object.entries({ STR: 0, VIT: 0, INT: 0, AGI: 0, DISC: 0 }).map(([stat, value]) => (
                  <div key={stat} className="sys-inset px-1 py-2 text-center">
                    <p className="label-caps text-[0.6rem] tracking-[0.12em] text-frost-500">{stat}</p>
                    <p className="mt-1 font-display text-xl font-bold text-frost-50">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`sys-title mt-7 text-base sm:text-lg ${status === 'online' ? 'text-clear-300' : 'text-system-200'}`}
          >
            {status === 'online' ? 'SYSTEM ONLINE' : 'YOUR JOURNEY BEGINS NOW.'}
          </motion.p>
        </AnimatePresence>
        {status !== 'online' && (
          <Button onClick={onFinish} className="mt-5 min-h-12 w-full text-base tracking-[0.2em] sm:w-auto sm:min-w-52">
            ENTER RANKORA
            <ChevronRight size={16} />
          </Button>
        )}
        {status === 'online' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex items-center justify-center gap-2 font-mono text-sm text-clear-200">
            <Check size={16} />
            Progression record saved
          </motion.div>
        )}
      </SystemPopup>
    </section>
  )
}

export default AwakeningPage
