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
  User,
} from 'lucide-react'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'
import { updatePlayerProfile } from '../../utils/settingsUtils.js'

const avatars = [
  { id: 'solar', label: 'Solar', icon: Sparkles, className: 'text-amber-200 bg-amber-300/10 border-amber-300/25' },
  { id: 'forge', label: 'Forge', icon: Dumbbell, className: 'text-rose-200 bg-rose-300/10 border-rose-300/25' },
  { id: 'oracle', label: 'Oracle', icon: Brain, className: 'text-violet-200 bg-violet-300/10 border-violet-300/25' },
  { id: 'pulse', label: 'Pulse', icon: HeartPulse, className: 'text-cyan-200 bg-cyan-300/10 border-cyan-300/25' },
]

const paths = [
  { id: 'fitness', title: 'FITNESS', focus: 'Strength & physical performance', icon: Dumbbell, tone: 'text-rose-300' },
  { id: 'knowledge', title: 'KNOWLEDGE', focus: 'Reading, learning & intellect', icon: Brain, tone: 'text-violet-300' },
  { id: 'discipline', title: 'DISCIPLINE', focus: 'Habits & self-control', icon: Scale, tone: 'text-amber-300' },
  { id: 'career', title: 'CAREER', focus: 'Coding & engineering growth', icon: BriefcaseBusiness, tone: 'text-cyan-300' },
  { id: 'balanced', title: 'BALANCED', focus: 'Equal progression across areas', icon: Sparkles, tone: 'text-emerald-300' },
]

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
    <Card variant="glass" className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-400/10 text-cyan-200">
            <CircleUserRound size={17} />
          </span>
          <div>
            <p className="label-caps text-cyan-300/80">IDENTITY & PROGRESSION</p>
            <h2 className="font-display text-base font-semibold text-white">
              PLAYER PROFILE
            </h2>
          </div>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
            <Check size={14} /> Profile Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Player Name */}
        <label className="block">
          <span className="label-caps text-slate-400">Player Call-Sign / Name</span>
          <input
            type="text"
            name="playerName"
            value={form.playerName}
            onChange={handleChange}
            placeholder="Enter player name"
            required
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 font-display text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(103,232,249,0.1)]"
          />
        </label>

        {/* Avatar Picker */}
        <div>
          <p className="label-caps text-slate-400">Avatar Icon</p>
          <div className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {avatars.map(({ id, label, icon: Icon, className }) => {
              const isSelected = form.avatar === id
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setForm((prev) => ({ ...prev, avatar: id }))}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 transition ${
                    isSelected
                      ? `${className} shadow-[0_0_20px_rgba(103,232,249,0.15)] ring-1 ring-cyan-300/50`
                      : 'border-white/10 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <Icon size={22} />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Physical Stats: Age, Height, Weight */}
        <div>
          <p className="label-caps text-slate-400">Physical Metrics (Optional)</p>
          <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="text-[0.68rem] text-slate-500 uppercase tracking-wider font-mono">
                Age
              </span>
              <input
                type="text"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="e.g. 26"
                className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-white outline-none transition focus:border-cyan-300/50 focus:bg-white/[0.06]"
              />
            </label>
            <label className="block">
              <span className="text-[0.68rem] text-slate-500 uppercase tracking-wider font-mono">
                Height
              </span>
              <input
                type="text"
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="e.g. 180 cm"
                className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-white outline-none transition focus:border-cyan-300/50 focus:bg-white/[0.06]"
              />
            </label>
            <label className="block">
              <span className="text-[0.68rem] text-slate-500 uppercase tracking-wider font-mono">
                Current Weight
              </span>
              <input
                type="text"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g. 78 kg"
                className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-white outline-none transition focus:border-cyan-300/50 focus:bg-white/[0.06]"
              />
            </label>
          </div>
        </div>

        {/* Primary Path */}
        <div>
          <p className="label-caps text-slate-400">Primary Path Focus</p>
          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {paths.map(({ id, title, focus, icon: Icon, tone }) => {
              const isSelected = form.primaryPath === id
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setForm((prev) => ({ ...prev, primaryPath: id }))}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? 'border-cyan-300/60 bg-cyan-400/10 shadow-[0_0_20px_rgba(103,232,249,0.12)]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  } ${id === 'balanced' ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 ${tone}`}>
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-xs font-semibold text-white">{title}</p>
                    <p className="text-[0.68rem] leading-relaxed text-slate-400 line-clamp-1">
                      {focus}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" className="min-w-40">
            <Check size={16} /> SAVE CHANGES
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ProfileSection
