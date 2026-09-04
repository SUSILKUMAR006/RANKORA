import { Bell, Skull, Trophy, Zap } from 'lucide-react'
import Card from '../common/Card.jsx'
import ToggleSwitch from './ToggleSwitch.jsx'

function NotificationSettingsSection({ settings, onUpdate }) {
  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-400/10 text-cyan-200">
          <Bell size={17} />
        </span>
        <div>
          <p className="label-caps text-cyan-300/80">TELEMETRY & ALERTS</p>
          <h2 className="font-display text-base font-semibold text-white">
            NOTIFICATION CHANNELS
          </h2>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        <ToggleSwitch
          label="System Telemetry Notifications"
          description="Receive in-app alerts for quest completions, level advancements, and character state changes."
          checked={settings.systemNotifications}
          onChange={(val) => onUpdate({ systemNotifications: val })}
        />

        <ToggleSwitch
          label="Achievement Honors & Milestones"
          description="Receive fanfare notifications when new codex achievements and milestones are claimed."
          checked={settings.achievementNotifications}
          onChange={(val) => onUpdate({ achievementNotifications: val })}
        />

        <ToggleSwitch
          label="Weekly Boss Battle Alerts"
          description="Receive active combat alerts when the weekly boss takes damage or when the arena window resets."
          checked={settings.bossNotifications}
          onChange={(val) => onUpdate({ bossNotifications: val })}
        />
      </div>
    </Card>
  )
}

export default NotificationSettingsSection
