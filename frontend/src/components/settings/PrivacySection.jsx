import { Lock, Shield, ShieldCheck } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import SystemWindow from '../common/SystemWindow.jsx'
import ToggleSwitch from './ToggleSwitch.jsx'

function PrivacySection({ settings, onUpdate }) {
  return (
    <SystemWindow
      title="Privacy Settings"
      tone="clear"
      icon={<ShieldCheck size={13} />}
      actions={
        <>
          <span className="label-caps hidden text-frost-600 md:inline">Security & data enclave</span>
          <Badge tone="success" className="shadow-[0_0_12px_-2px_rgba(52,217,156,0.45)]">
            <Lock size={10} /> Local-First Enclave
          </Badge>
        </>
      }
      bodyClassName="pt-1"
    >
      <div className="divide-y divide-edge/60">
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

      <div className="sys-inset mt-3 border-l-2 border-l-clear-400/70 px-4 py-3">
        <p className="label-caps flex items-center gap-2 text-clear-300">
          <Shield size={13} /> Zero-Cloud Guarantee
        </p>
        <p className="mt-1.5 text-xs leading-5 text-frost-400">
          RANKORA operates with client-side sovereignty. No analytics trackers, AI models,
          or cloud APIs receive your quest logs, biometric checkpoints, or personal reflections.
        </p>
      </div>
    </SystemWindow>
  )
}

export default PrivacySection
