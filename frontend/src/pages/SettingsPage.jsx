import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  Check,
  CircleUserRound,
  Database,
  KeyRound,
  Palette,
  Settings,
  ShieldCheck,
  Swords,
} from 'lucide-react'
import { PageHeader } from '../components/common/SectionHeader.jsx'
import AccountSection from '../components/settings/AccountSection.jsx'
import AppearanceSection from '../components/settings/AppearanceSection.jsx'
import DataManagementSection from '../components/settings/DataManagementSection.jsx'
import NotificationSettingsSection from '../components/settings/NotificationSettingsSection.jsx'
import PrivacySection from '../components/settings/PrivacySection.jsx'
import ProfileSection from '../components/settings/ProfileSection.jsx'
import QuestDefaultsSection from '../components/settings/QuestDefaultsSection.jsx'
import { fallbackPlayer, getStoredPlayer } from '../data/mockDashboardData.js'
import { getStoredSettings, saveSettings } from '../utils/settingsUtils.js'

function SettingsPage() {
  const [player, setPlayer] = useState(() => getStoredPlayer() || fallbackPlayer)
  const [settings, setSettings] = useState(() => getStoredSettings())
  const [savedToast, setSavedToast] = useState(false)

  const handleUpdateSettings = (partial) => {
    const updated = { ...settings, ...partial }
    setSettings(updated)
    saveSettings(updated)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2000)
  }

  const handleProfileSaved = (updatedPlayer) => {
    setPlayer(updatedPlayer)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2000)
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const navItems = [
    { id: 'profile-section', label: 'Profile', icon: CircleUserRound },
    { id: 'quest-defaults-section', label: 'Quest Defaults', icon: Swords },
    { id: 'notifications-section', label: 'Notifications', icon: Bell },
    { id: 'appearance-section', label: 'Appearance', icon: Palette },
    { id: 'privacy-section', label: 'Privacy', icon: ShieldCheck },
    { id: 'data-section', label: 'Data Management', icon: Database },
    { id: 'account-section', label: 'Account', icon: KeyRound },
  ]

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <PageHeader
        eyebrow="System protocols"
        title={
          <>
            <span className="text-system-400">[</span> System Settings <span className="text-system-400">]</span>
          </>
        }
        description="Configure player parameters, quest automation presets, notification channels, appearance, and data sovereignty."
        actions={
          savedToast && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.3 }}
              animate={{ opacity: 1, scaleY: 1 }}
              className="flex origin-top items-center gap-2 border border-clear-400/60 bg-clear-500/10 px-3.5 py-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-clear-200 shadow-[0_0_18px_-4px_rgba(52,217,156,0.6)]"
            >
              <Check size={15} />
              <span>Settings Synchronized</span>
            </motion.div>
          )
        }
      />

      {/* Quick Navigation Anchor Bar */}
      <div className="sticky top-19 z-10 -mx-1 overflow-x-auto border border-edge bg-void-950/90 p-1 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md sm:mx-0">
        <div className="flex min-w-max items-center gap-1">
          <span className="label-caps hidden shrink-0 items-center gap-2 px-2.5 text-frost-600 md:flex">
            <Settings size={13} className="text-system-400" /> Jump
          </span>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="flex shrink-0 items-center gap-2 border border-transparent px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-frost-400 transition-colors hover:border-edge-strong hover:bg-void-850 hover:text-frost-50"
              >
                <Icon size={14} className="text-system-400/80" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="space-y-6">
        {/* 1. Profile Section */}
        <section className="scroll-mt-36" id="profile-section">
          <ProfileSection player={player} onSaved={handleProfileSaved} />
        </section>

        {/* 2. Quest Defaults Section */}
        <section className="scroll-mt-36" id="quest-defaults-section">
          <QuestDefaultsSection settings={settings} onUpdate={handleUpdateSettings} />
        </section>

        {/* 3. Notification Settings Section */}
        <section className="scroll-mt-36" id="notifications-section">
          <NotificationSettingsSection settings={settings} onUpdate={handleUpdateSettings} />
        </section>

        {/* 4. Appearance Section */}
        <section className="scroll-mt-36" id="appearance-section">
          <AppearanceSection settings={settings} onUpdate={handleUpdateSettings} />
        </section>

        {/* 5. Privacy Section */}
        <section className="scroll-mt-36" id="privacy-section">
          <PrivacySection settings={settings} onUpdate={handleUpdateSettings} />
        </section>

        {/* 6. Data Management Section */}
        <section className="scroll-mt-36" id="data-section">
          <DataManagementSection
            onDataCleared={() => {
              window.location.href = '/awakening'
            }}
          />
        </section>

        {/* 7. Account Section */}
        <section className="scroll-mt-36" id="account-section">
          <AccountSection player={player} />
        </section>
      </div>

      {/* System Status Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-frost-600"
      >
        Rankora System Configuration · Local-First Data Enclave · v1.0
      </motion.p>
    </div>
  )
}

export default SettingsPage
