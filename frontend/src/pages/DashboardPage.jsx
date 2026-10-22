import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SystemMessage from '../components/common/SystemMessage.jsx'
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx'
import PlayerStatusCard from '../components/dashboard/PlayerStatusCard.jsx'
import QuestPreview from '../components/dashboard/QuestPreview.jsx'
import QuickActions from '../components/dashboard/QuickActions.jsx'
import RecentAchievement from '../components/dashboard/RecentAchievement.jsx'
import SystemAnalysisCard from '../components/dashboard/SystemAnalysisCard.jsx'
import TodayProgress from '../components/dashboard/TodayProgress.jsx'
import WeeklyBossCard from '../components/dashboard/WeeklyBossCard.jsx'
import WeeklyOverview from '../components/dashboard/WeeklyOverview.jsx'
import DailyWorkoutCard from '../components/workout/DailyWorkoutCard.jsx'
import {
  dashboardData,
  fallbackPlayer,
  getStoredPlayer,
  quickActions,
} from '../data/mockDashboardData.js'
import { getStoredQuests } from '../hooks/useQuestCompletion.js'
import { syncQuestsFromServer } from '../services/questSync.js'
import { getLatestUnlockedAchievement } from '../utils/achievementUtils.js'
import { getStoredWeeklyBoss } from '../utils/bossUtils.js'
import { getWeeklyOverview } from '../utils/dailyLogUtils.js'
import { getEffectiveStreak } from '../utils/xpUtils.js'

function DashboardPage() {
  const [player, setPlayer] = useState(getStoredPlayer)
  const [quests, setQuests] = useState(() => getStoredQuests())
  const [recentAchievement, setRecentAchievement] = useState(() =>
    getLatestUnlockedAchievement()
  )
  const [boss, setBoss] = useState(
    () => getStoredWeeklyBoss()?.currentBoss || dashboardData.boss
  )
  const [weekly, setWeekly] = useState(() => getWeeklyOverview())
  const [syncFailed, setSyncFailed] = useState(false)

  const handleRefresh = () => {
    setPlayer(getStoredPlayer())
    setQuests(getStoredQuests())
    setRecentAchievement(getLatestUnlockedAchievement())
    setBoss(getStoredWeeklyBoss()?.currentBoss || dashboardData.boss)
    setWeekly(getWeeklyOverview())
  }

  useEffect(() => {
    // Server is authoritative for "what day is it" and streak/history —
    // reconcile the local mirror against it so a stale browser clock or
    // localStorage never leaves quests/streak stuck on yesterday. If the
    // network/backend is unavailable, the existing local snapshot is kept.
    syncQuestsFromServer().then(({ quests: serverQuests, player: serverPlayer }) => {
      setSyncFailed(!serverQuests && !serverPlayer)
      if (serverQuests) setQuests(serverQuests)
      if (serverPlayer) setPlayer(serverPlayer)
      setWeekly(getWeeklyOverview())
    })

    window.addEventListener('storage', handleRefresh)
    window.addEventListener('rankora-player-updated', handleRefresh)
    window.addEventListener('rankora-workout-updated', handleRefresh)
    return () => {
      window.removeEventListener('storage', handleRefresh)
      window.removeEventListener('rankora-player-updated', handleRefresh)
      window.removeEventListener('rankora-workout-updated', handleRefresh)
    }
  }, [])

  return (
    <div className="space-y-8 pb-8">
      <DashboardHeader playerName={player.playerName || fallbackPlayer.playerName} />

      {syncFailed && (
        <SystemMessage
          tone="penalty"
          eyebrow="Warning · Connection lost"
          title="Server unreachable"
          message="Could not reach the server — showing your last saved data. Progress made now may not be recorded until connection is restored."
        />
      )}

      {/* Primary window: player status */}
      <PlayerStatusCard player={player} />

      {/* Today at a glance */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <TodayProgress quests={quests} />
        <WeeklyOverview weekly={weekly} streak={getEffectiveStreak(player)} />
      </div>

      {/* Daily Workout Split Protocol & Exercise Checklist + Daily Quests */}
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <DailyWorkoutCard onQuestCompleted={handleRefresh} />
        <QuestPreview quests={quests.slice(0, 6)} />
      </div>

      {/* Boss + rewards / commands */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <WeeklyBossCard boss={boss} />
        <div className="space-y-6">
          <RecentAchievement achievement={recentAchievement} />
          <QuickActions actions={quickActions} />
        </div>
      </div>

      <SystemAnalysisCard analysis={dashboardData.analysis} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3"
      >
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-edge" />
        <p className="label-caps flex items-center gap-2 text-center text-[0.62rem] text-frost-600">
          <span className="h-1 w-1 rotate-45 animate-sys-pulse bg-system-400" />
          The System is observing your progress
          <span className="h-1 w-1 rotate-45 animate-sys-pulse bg-system-400" />
        </p>
        <span className="h-px flex-1 bg-linear-to-l from-transparent to-edge" />
      </motion.div>
    </div>
  )
}

export default DashboardPage
