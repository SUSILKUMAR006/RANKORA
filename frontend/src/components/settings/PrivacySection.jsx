import { Lock, Shield, ShieldCheck } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Card from '../common/Card.jsx'
import ToggleSwitch from './ToggleSwitch.jsx'

function PrivacySection({ settings, onUpdate }) {
  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
            <ShieldCheck size={17} />
          </span>
          <div>
            <p className="label-caps text-emerald-300/80">SECURITY & DATA ENCLAVE</p>
            <h2 className="font-display text-base font-semibold text-white">
              PRIVACY SETTINGS
            </h2>
          </div>
        </div>

        <Badge tone="success" className="gap-1 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
          <Lock size={10} /> Local-First Enclave
        </Badge>
      </div>

      <div className="divide-y divide-white/5">
        <ToggleSwitch
          label="Progress Photos: Private by Default"
          description="Ensures all uploaded transformation checkpoint photos are isolated strictly to local client storage."
          checked={settings.photosPrivate !== false}
          onChange={(val) => onUpdate({ photosPrivate: val })}
        />

        <ToggleSwitch
          label="Diary & Reflection Notes: Private by Default"
          description="Locks daily reflections, mission notes, and cognitive logs to private local storage."
          checked={settings.diaryPrivate !== false}
          onChange={(val) => onUpdate({ diaryPrivate: val })}
        />
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs leading-relaxed text-slate-400">
        <p className="flex items-center gap-2 font-mono text-[0.68rem] text-emerald-300 font-semibold uppercase tracking-wider">
          <Shield size={13} /> Zero-Cloud Guarantee
        </p>
        <p className="mt-1 text-[0.72rem] text-slate-400">
          RANKORA operates with client-side sovereignty. No analytics trackers, AI models,
          or cloud APIs receive your quest logs, biometric checkpoints, or personal reflections.
        </p>
      </div>
    </Card>
  )
}

export default PrivacySection
