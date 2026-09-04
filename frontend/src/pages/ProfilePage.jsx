import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CircleUserRound, Shield, Sparkles } from 'lucide-react'
import PlayerHeroBanner from '../components/player/PlayerHeroBanner.jsx'
import PlayerProgressSummary from '../components/player/PlayerProgressSummary.jsx'
import PlayerRecentActivity from '../components/player/PlayerRecentActivity.jsx'
import PlayerStatsGrid from '../components/player/PlayerStatsGrid.jsx'
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
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
              <CircleUserRound size={14} />
            </span>
            <p className="label-caps text-cyan-300/80">CHARACTER SHEET & CODEX</p>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            PLAYER PROFILE & STATS
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Comprehensive character overview: RPG attribute progression, milestone achievements,
            streak reliability, and live execution history.
          </p>
        </div>
      </motion.header>

      {/* 1. Player Hero Banner */}
      <PlayerHeroBanner data={profileData} />

      {/* 2. Character RPG Attributes Grid (STR, VIT, INT, AGI, DISC) */}
      <PlayerStatsGrid stats={profileData.stats} />

      {/* 3. Milestone Tallies & Progress Summary */}
      <PlayerProgressSummary summary={profileData.progressSummary} />

      {/* 4. Unified Recent Activity Log Feed */}
      <PlayerRecentActivity activities={profileData.recentActivity} />

      {/* System Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-700"
      >
        Rankora Character Sheet · Local Codex Verified · Level {profileData?.player?.level || 1}
      </motion.p>
    </div>
  )
}

export default ProfilePage
