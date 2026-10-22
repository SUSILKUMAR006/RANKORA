import { useState } from 'react'
import {
  Brain,
  BriefcaseBusiness,
  Check,
  CircleUserRound,
  Dumbbell,
  HeartPulse,
  Scale,
  Sparkles,
} from 'lucide-react'
import Button from '../common/Button.jsx'
import SystemWindow from '../common/SystemWindow.jsx'
import { updatePlayerProfile } from '../../utils/settingsUtils.js'

const avatars = [
  { id: 'solar', label: 'Solar', icon: Sparkles, className: 'text-gold-200 bg-gold-500/10 border-gold-400/70 shadow-[0_0_16px_-4px_rgba(255,194,51,0.6)]' },
  { id: 'forge', label: 'Forge', icon: Dumbbell, className: 'text-penalty-200 bg-penalty-500/10 border-penalty-400/70 shadow-[0_0_16px_-4px_rgba(240,42,62,0.6)]' },
  { id: 'oracle', label: 'Oracle', icon: Brain, className: 'text-shadow-200 bg-shadow-500/10 border-shadow-400/70 shadow-[0_0_16px_-4px_rgba(155,107,255,0.6)]' },
  { id: 'pulse', label: 'Pulse', icon: HeartPulse, className: 'text-system-200 bg-system-500/10 border-system-400 shadow-[0_0_16px_-4px_rgba(30,144,255,0.6)]' },
]

const paths = [
  { id: 'fitness', title: 'FITNESS', focus: 'Strength & physical performance', icon: Dumbbell, tone: 'text-penalty-300' },
  { id: 'knowledge', title: 'KNOWLEDGE', focus: 'Reading, learning & intellect', icon: Brain, tone: 'text-shadow-300' },
  { id: 'discipline', title: 'DISCIPLINE', focus: 'Habits & self-control', icon: Scale, tone: 'text-gold-300' },
  { id: 'career', title: 'CAREER', focus: 'Coding & engineering growth', icon: BriefcaseBusiness, tone: 'text-system-300' },
  { id: 'balanced', title: 'BALANCED', focus: 'Equal progression across areas', icon: Sparkles, tone: 'text-clear-300' },
]

const labelClass = 'label-caps mb-1.5 block text-frost-400'

function ProfileSection({ player, onSaved }) {
  const [form, setForm] = useState({
    playerName: player?.playerName || 'PLAYER',
    avatar: player?.avatar || 'solar',
    age: player?.age || '',
    height: player?.height || '',
    weight: player?.weight || '',
    primaryPath: player?.primaryPath || 'balanced',
  })
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updated = updatePlayerProfile({
      playerName: form.playerName.trim() || 'PLAYER',
      avatar: form.avatar,
      age: form.age,
      height: form.height,
      weight: form.weight,
      primaryPath: form.primaryPath,
    })
    setSavedSuccess(true)
    if (onSaved) onSaved(updated)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <SystemWindow
      title="Player Profile"
      tone="shadow"
      icon={<CircleUserRound size={13} />}
      actions={
        savedSuccess ? (
          <span className="inline-flex items-center gap-1.5 border border-clear-400/60 bg-clear-500/10 px-2 py-0.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-clear-200 shadow-[0_0_12px_-2px_rgba(52,217,156,0.5)]">
            <Check size={12} /> Profile Saved
          </span>
        ) : (
          <span className="label-caps hidden text-frost-600 sm:inline">Identity & progression</span>
        )
      }
    >
      <form onSubmit={handleSubmit} className="divide-y divide-edge/60">
        {/* Player Name */}
        <div className="pb-5">
          <label className="block">
            <span className={labelClass}>Player call-sign / name</span>
            <input
              type="text"
              name="playerName"
              value={form.playerName}
              onChange={handleChange}
              placeholder="Enter player name"
              required
              className="field font-display text-base font-bold uppercase tracking-[0.08em]"
            />
          </label>
        </div>

        {/* Avatar Picker */}
        <div className="py-5">
          <p className={labelClass}>Avatar icon</p>
          <div className="mt-1 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {avatars.map(({ id, label, icon: Icon, className }) => {
              const isSelected = form.avatar === id
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setForm((prev) => ({ ...prev, avatar: id }))}
                  aria-pressed={isSelected}
                  className={`relative flex flex-col items-center gap-2 rounded-xs border p-3.5 transition-[border-color,background-color,box-shadow,color] duration-150 ${
                    isSelected
                      ? className
                      : 'border-edge bg-void-950/50 text-frost-500 hover:border-edge-strong hover:text-frost-200'
                  }`}
                >
                  <Icon size={22} />
                  <span className="font-display text-xs font-bold uppercase tracking-[0.14em]">{label}</span>
                  {isSelected && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rotate-45 bg-current" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Physical Stats: Age, Height, Weight */}
        <div className="py-5">
          <p className={labelClass}>
            Physical metrics <span className="text-frost-600">(optional)</span>
          </p>
          <div className="mt-1 grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block font-mono text-[0.68rem] uppercase tracking-wider text-frost-500">Age</span>
              <input
                type="text"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="e.g. 26"
                className="field font-mono"
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-mono text-[0.68rem] uppercase tracking-wider text-frost-500">Height</span>
              <input
                type="text"
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="e.g. 180 cm"
                className="field font-mono"
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-mono text-[0.68rem] uppercase tracking-wider text-frost-500">Current Weight</span>
              <input
                type="text"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g. 78 kg"
                className="field font-mono"
              />
            </label>
          </div>
        </div>

        {/* Primary Path */}
        <div className="py-5">
          <p className={labelClass}>Primary path focus</p>
          <div className="mt-1 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {paths.map(({ id, title, focus, icon: Icon, tone }) => {
              const isSelected = form.primaryPath === id
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setForm((prev) => ({ ...prev, primaryPath: id }))}
                  aria-pressed={isSelected}
                  className={`flex items-start gap-3 rounded-xs border p-3 text-left transition-[border-color,background-color,box-shadow] duration-150 ${
                    isSelected
                      ? 'border-system-400 bg-system-500/15 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
                      : 'border-edge bg-void-950/50 hover:border-edge-strong hover:bg-void-850'
                  } ${id === 'balanced' ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center border border-edge bg-void-900 ${tone}`}>
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold uppercase tracking-widest text-frost-50">{title}</p>
                    <p className="line-clamp-1 text-xs leading-5 text-frost-400">{focus}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-5">
          <Button type="submit" variant="primary" className="w-full sm:w-auto sm:min-w-40">
            <Check size={16} /> SAVE CHANGES
          </Button>
        </div>
      </form>
    </SystemWindow>
  )
}

export default ProfileSection
