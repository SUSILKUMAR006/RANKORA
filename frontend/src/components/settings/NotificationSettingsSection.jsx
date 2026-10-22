import { Bell } from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'
import ToggleSwitch from './ToggleSwitch.jsx'

function NotificationSettingsSection({ settings, onUpdate }) {
  return (
    <SystemWindow
      title="Notification Channels"
      icon={<Bell size={13} />}
      actions={<span className="label-caps hidden text-frost-600 sm:inline">Telemetry & alerts</span>}
      bodyClassName="py-1"
    >
      <div className="divide-y divide-edge/60">
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
    </SystemWindow>
  )
}

export default NotificationSettingsSection
