import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  Check,
  CircleUserRound,
  Database,
  KeyRound,
  Lock,
  Palette,
  Settings,
  ShieldCheck,
  Swords,
} from 'lucide-react'
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
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
              <Settings size={14} />
            </span>
            <p className="label-caps text-cyan-300/80">SYSTEM PROTOCOLS</p>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            SETTINGS
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Configure player parameters, quest automation presets, notification channels,
            appearance, and data sovereignty.
          </p>
        </div>

        {savedToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/15 px-3.5 py-2 font-mono text-xs font-semibold text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.25)]"
          >
            <Check size={15} />
            <span>Settings Synchronized</span>
          </motion.div>
        )}
      </motion.header>

      {/* Quick Navigation Anchor Bar */}
      <div className="sticky top-20 z-20 -mx-2 flex overflow-x-auto rounded-2xl border border-white/10 bg-rankora-950/90 p-1.5 backdrop-blur-xl sm:mx-0">
        <div className="flex min-w-full items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 font-mono text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="space-y-8">
        {/* 1. Profile Section */}
        <section id="profile-section">
          <ProfileSection player={player} onSaved={handleProfileSaved} />
        </section>

        {/* 2. Quest Defaults Section */}
        <section id="quest-defaults-section">
          <QuestDefaultsSection settings={settings} onUpdate={handleUpdateSettings} />
        </section>

        {/* 3. Notification Settings Section */}
        <section id="notifications-section">
          <NotificationSettingsSection settings={settings} onUpdate={handleUpdateSettings} />
        </section>

        {/* 4. Appearance Section */}
        <section id="appearance-section">
          <AppearanceSection settings={settings} onUpdate={handleUpdateSettings} />
        </section>

        {/* 5. Privacy Section */}
        <section id="privacy-section">
          <PrivacySection settings={settings} onUpdate={handleUpdateSettings} />
        </section>

        {/* 6. Data Management Section */}
        <section id="data-section">
          <DataManagementSection
            onDataCleared={() => {
              window.location.href = '/awakening'
            }}
          />
        </section>

        {/* 7. Account Section */}
        <section id="account-section">
          <AccountSection player={player} />
        </section>
      </div>

      {/* System Status Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-700"
      >
        Rankora System Configuration · Local-First Data Enclave · v1.0
      </motion.p>
    </div>
  )
}

export default SettingsPage
