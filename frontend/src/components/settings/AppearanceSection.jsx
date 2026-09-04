import { Check, Eye, Moon, Palette, Sparkles } from 'lucide-react'
import Card from '../common/Card.jsx'
import ToggleSwitch from './ToggleSwitch.jsx'

const themes = [
  {
    id: 'dark-cyberpunk',
    name: 'RANKORA Dark (Default)',
    detail: 'Balanced dark futuristic interface with cyan and amber accents',
    colorBox: 'from-[#071016] via-[#10242d] to-[#67e8f9]',
  },
  {
    id: 'deep-obsidian',
    name: 'Deep Obsidian',
    detail: 'Ultra-dark OLED aesthetic with subtle monochrome borders',
    colorBox: 'from-[#020508] via-[#080e14] to-[#94a3b8]',
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    detail: 'High-contrast glowing violet and cyan matrix illumination',
    colorBox: 'from-[#071016] via-[#1b1534] to-[#a78bfa]',
  },
]

function AppearanceSection({ settings, onUpdate }) {
  return (
    <Card variant="glass" className="space-y-5">
      <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-violet-300/30 bg-violet-400/10 text-violet-200">
          <Palette size={17} />
        </span>
        <div>
          <p className="label-caps text-violet-300/80">VISUAL ENVIRONMENT</p>
          <h2 className="font-display text-base font-semibold text-white">
            APPEARANCE & THEME
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="label-caps text-slate-400">Interface Theme Palette</p>
          <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
            {themes.map((theme) => {
              const isSelected = (settings.theme || 'dark-cyberpunk') === theme.id
              return (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => onUpdate({ theme: theme.id })}
                  className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-cyan-300/60 bg-cyan-400/10 shadow-[0_0_20px_rgba(103,232,249,0.12)]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`h-4 w-12 rounded-full bg-gradient-to-r ${theme.colorBox} border border-white/10`} />
                      {isSelected && (
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-cyan-300 text-rankora-950">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-display text-xs font-semibold text-white">
                      {theme.name}
                    </h3>
                    <p className="mt-1 text-[0.68rem] leading-relaxed text-slate-400">
                      {theme.detail}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-t border-white/5 pt-2">
          <ToggleSwitch
            label="Ambient Glow & Particle Effects"
            description="Enable radiant neon glows and ambient light effects on badges, cards, and modal windows."
            checked={settings.glowEffects !== false}
            onChange={(val) => onUpdate({ glowEffects: val })}
          />
        </div>
      </div>
    </Card>
  )
}

export default AppearanceSection
