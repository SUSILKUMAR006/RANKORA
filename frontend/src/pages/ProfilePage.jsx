import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PlayerHeroBanner from '../components/player/PlayerHeroBanner.jsx'
import PlayerProgressSummary from '../components/player/PlayerProgressSummary.jsx'
import PlayerRecentActivity from '../components/player/PlayerRecentActivity.jsx'
import PlayerStatsGrid from '../components/player/PlayerStatsGrid.jsx'
import { PageHeader } from '../components/common/SectionHeader.jsx'
import { getFullProfileData } from '../utils/profileUtils.js'

function ProfilePage() {
  const [profileData, setProfileData] = useState(() => getFullProfileData())

  useEffect(() => {
    const handleUpdate = () => {
      setProfileData(getFullProfileData())
    }

    window.addEventListener('storage', handleUpdate)
    window.addEventListener('rankora-player-updated', handleUpdate)
    window.addEventListener('rankora-notifications-updated', handleUpdate)
    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('rankora-player-updated', handleUpdate)
      window.removeEventListener('rankora-notifications-updated', handleUpdate)
    }
  }, [])

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <PageHeader
        eyebrow="Character sheet & codex"
        title="Player Profile & Stats"
        description="Comprehensive character overview: RPG attribute progression, milestone achievements, streak reliability, and live execution history."
      />

      {/* 1. Status window */}
      <PlayerHeroBanner data={profileData} />

      {/* 2. Stat block (STR, VIT, INT, AGI, DISC) */}
      <PlayerStatsGrid stats={profileData.stats} />

      {/* 3 + 4. System logs: milestone tallies & recent activity */}
      <div className="grid gap-6 xl:grid-cols-2">
        <PlayerProgressSummary summary={profileData.progressSummary} />
        <PlayerRecentActivity activities={profileData.recentActivity} />
      </div>

      {/* System Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-frost-600"
      >
        Rankora Character Sheet · Local Codex Verified · Level {profileData?.player?.level || 1}
      </motion.p>
    </div>
  )
}

export default ProfilePage
