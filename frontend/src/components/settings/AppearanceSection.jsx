import { Check, Palette } from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'
import ToggleSwitch from './ToggleSwitch.jsx'

// Theme ids are persisted settings values: keep them exactly as they are.
const themes = [
  {
    id: 'dark-cyberpunk',
    name: 'System Blue (Default)',
    detail: 'The standard System interface: void-navy windows with electric-blue frames.',
    swatch: ['bg-void-950', 'bg-void-800', 'bg-system-600', 'bg-system-400'],
  },
  {
    id: 'deep-obsidian',
    name: 'Shadow Monarch',
    detail: 'Ultra-dark OLED void with quiet monarch-purple borders.',
    swatch: ['bg-void-950', 'bg-shadow-950', 'bg-shadow-700', 'bg-shadow-400'],
  },
  {
    id: 'cyber-neon',
    name: 'Red Gate',
    detail: 'High-contrast dungeon-break glow: gate red over system blue.',
    swatch: ['bg-void-950', 'bg-penalty-900', 'bg-penalty-500', 'bg-system-400'],
  },
]

function AppearanceSection({ settings, onUpdate }) {
  return (
    <SystemWindow
      title="Appearance & Theme"
      icon={<Palette size={13} />}
      actions={<span className="label-caps hidden text-frost-600 sm:inline">Visual environment</span>}
      bodyClassName="pb-1"
    >
      <div>
        <p className="label-caps text-frost-400">Interface theme palette</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {themes.map((theme) => {
            const isSelected = (settings.theme || 'dark-cyberpunk') === theme.id
            return (
              <button
                type="button"
                key={theme.id}
                onClick={() => onUpdate({ theme: theme.id })}
                aria-pressed={isSelected}
                className={`relative flex flex-col rounded-xs border p-4 text-left transition-[border-color,background-color,box-shadow] duration-150 ${
                  isSelected
                    ? 'border-system-400 bg-system-500/10 shadow-[0_0_16px_-4px_rgba(30,144,255,0.6),inset_0_0_16px_-8px_rgba(30,144,255,0.5)]'
                    : 'border-edge bg-void-950/50 hover:border-edge-strong hover:bg-void-850'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-5 border border-edge-strong">
                    {theme.swatch.map((swatch) => (
                      <span key={swatch} className={`h-full w-4 ${swatch}`} />
                    ))}
                  </div>
                  {isSelected ? (
                    <span className="grid h-5 w-5 place-items-center border border-system-400 bg-system-500/30 text-frost-50 shadow-[0_0_10px_rgba(30,144,255,0.7)]">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="h-5 w-5 border border-edge" />
                  )}
                </div>
                <h3 className="mt-3 font-display text-sm font-bold uppercase tracking-[0.08em] text-frost-50">{theme.name}</h3>
                <p className="mt-1 text-xs leading-5 text-frost-400">{theme.detail}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 border-t border-edge/60">
        <ToggleSwitch
          label="Ambient Glow & Particle Effects"
          description="Enable radiant glows and ambient light effects on badges, windows, and System pop-ups."
          checked={settings.glowEffects !== false}
          onChange={(val) => onUpdate({ glowEffects: val })}
        />
      </div>
    </SystemWindow>
  )
}

export default AppearanceSection
