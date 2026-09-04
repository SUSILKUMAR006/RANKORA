import { Shield, Sparkles, Swords } from 'lucide-react'
import Card from '../common/Card.jsx'

function QuestDefaultsSection({ settings, onUpdate }) {
  const difficulties = [
    { id: 'Easy', label: 'Easy', detail: '+10 to 20 XP baseline' },
    { id: 'Normal', label: 'Normal', detail: '+25 to 50 XP standard' },
    { id: 'Hard', label: 'Hard', detail: '+50 to 100 XP elite' },
  ]

  const types = [
    { id: 'Mandatory', label: 'Mandatory', detail: 'Essential daily discipline anchors' },
    { id: 'Optional', label: 'Optional', detail: 'Flexible bonus objectives' },
  ]

  const verifications = [
    { id: 'None', label: 'None', detail: 'Instant one-click completion' },
    { id: 'Photo Required', label: 'Photo Required', detail: 'Requires snapshot evidence' },
    { id: 'Photo + Reflection Note', label: 'Photo + Reflection Note', detail: 'Requires proof and brief notes' },
  ]

  return (
    <Card variant="glass" className="space-y-6">
      <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-amber-300/30 bg-amber-400/10 text-amber-200">
          <Swords size={17} />
        </span>
        <div>
          <p className="label-caps text-amber-300/80">AUTOMATION & PRESETS</p>
          <h2 className="font-display text-base font-semibold text-white">
            QUEST DEFAULTS
          </h2>
        </div>
      </div>

      <div className="space-y-5">
        {/* Default Difficulty */}
        <div>
          <p className="label-caps text-slate-400">Default Quest Difficulty</p>
          <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
            {difficulties.map((diff) => {
              const isSelected = settings.defaultDifficulty === diff.id
              return (
                <button
                  type="button"
                  key={diff.id}
                  onClick={() => onUpdate({ defaultDifficulty: diff.id })}
                  className={`rounded-xl border p-3.5 text-left transition ${
                    isSelected
                      ? 'border-amber-300/60 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.12)]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <p className="font-display text-xs font-semibold text-white">{diff.label}</p>
                  <p className="mt-1 text-[0.68rem] text-slate-400">{diff.detail}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Default Quest Type */}
        <div>
          <p className="label-caps text-slate-400">Default Mission Classification</p>
          <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
            {types.map((type) => {
              const isSelected = settings.defaultQuestType === type.id
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => onUpdate({ defaultQuestType: type.id })}
                  className={`rounded-xl border p-3.5 text-left transition ${
                    isSelected
                      ? 'border-cyan-300/60 bg-cyan-400/10 shadow-[0_0_20px_rgba(103,232,249,0.12)]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <p className="font-display text-xs font-semibold text-white">{type.label}</p>
                  <p className="mt-1 text-[0.68rem] text-slate-400">{type.detail}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Default Verification Mode */}
        <div>
          <p className="label-caps text-slate-400">Default Verification Mode</p>
          <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
            {verifications.map((v) => {
              const isSelected = settings.defaultVerification === v.id
              return (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => onUpdate({ defaultVerification: v.id })}
                  className={`rounded-xl border p-3.5 text-left transition ${
                    isSelected
                      ? 'border-violet-300/60 bg-violet-400/10 shadow-[0_0_20px_rgba(167,139,250,0.12)]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <p className="font-display text-xs font-semibold text-white">{v.label}</p>
                  <p className="mt-1 text-[0.68rem] text-slate-400">{v.detail}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default QuestDefaultsSection
