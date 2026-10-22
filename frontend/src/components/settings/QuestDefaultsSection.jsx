import { Swords } from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'

const optionBase =
  'relative flex items-start gap-3 rounded-xs border p-3.5 text-left transition-[border-color,background-color,box-shadow,color] duration-150'
const optionActive =
  'border-system-400 bg-system-500/15 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
const optionIdle = 'border-edge bg-void-950/50 hover:border-edge-strong hover:bg-void-850'

function OptionMarker({ active }) {
  return (
    <span
      className={`mt-1 h-2 w-2 shrink-0 rotate-45 border ${
        active ? 'border-system-300 bg-system-400 shadow-[0_0_8px_rgba(74,174,255,0.9)]' : 'border-frost-600'
      }`}
    />
  )
}

function SettingRow({ label, children }) {
  return (
    <div className="grid gap-3 py-4 first:pt-0 last:pb-0 lg:grid-cols-[13rem_1fr] lg:gap-6">
      <p className="label-caps pt-1 text-frost-400">{label}</p>
      {children}
    </div>
  )
}

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

  const renderOption = (option, isSelected, onSelect, detailClass = 'text-frost-400') => (
    <button
      type="button"
      key={option.id}
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`${optionBase} ${isSelected ? optionActive : optionIdle}`}
    >
      <OptionMarker active={isSelected} />
      <span className="min-w-0">
        <span className={`block font-display text-sm font-bold uppercase tracking-[0.08em] ${isSelected ? 'text-frost-50' : 'text-frost-200'}`}>
          {option.label}
        </span>
        <span className={`mt-0.5 block text-xs ${detailClass}`}>{option.detail}</span>
      </span>
    </button>
  )

  return (
    <SystemWindow
      title="Quest Defaults"
      icon={<Swords size={13} />}
      actions={<span className="label-caps hidden text-frost-600 sm:inline">Automation & presets</span>}
    >
      <div className="divide-y divide-edge/60">
        {/* Default Difficulty */}
        <SettingRow label="Default quest difficulty">
          <div className="grid gap-2.5 sm:grid-cols-3">
            {difficulties.map((diff) =>
              renderOption(
                diff,
                settings.defaultDifficulty === diff.id,
                () => onUpdate({ defaultDifficulty: diff.id }),
                'font-mono text-gold-300/80'
              )
            )}
          </div>
        </SettingRow>

        {/* Default Quest Type */}
        <SettingRow label="Default mission classification">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {types.map((type) =>
              renderOption(type, settings.defaultQuestType === type.id, () => onUpdate({ defaultQuestType: type.id }))
            )}
          </div>
        </SettingRow>

        {/* Default Verification Mode */}
        <SettingRow label="Default verification mode">
          <div className="grid gap-2.5 sm:grid-cols-3">
            {verifications.map((v) =>
              renderOption(v, settings.defaultVerification === v.id, () => onUpdate({ defaultVerification: v.id }))
            )}
          </div>
        </SettingRow>
      </div>
    </SystemWindow>
  )
}

export default QuestDefaultsSection
