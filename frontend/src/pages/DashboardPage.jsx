import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
    <div className="space-y-10 pb-8">
      <DashboardHeader playerName={player.playerName || fallbackPlayer.playerName} />
      <PlayerStatusCard player={player} />

      {/* Daily Workout Split Protocol & Exercise Checklist */}
      <section>
        <DailyWorkoutCard onQuestCompleted={handleRefresh} />
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <TodayProgress quests={quests} />
        <WeeklyOverview weekly={weekly} streak={getEffectiveStreak(player)} />
      </div>

      <QuestPreview quests={quests.slice(0, 6)} />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SystemAnalysisCard analysis={dashboardData.analysis} />
        <WeeklyBossCard boss={boss} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <QuickActions actions={quickActions} />
        <RecentAchievement achievement={recentAchievement} />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-700"
      >
        RANKORA TELEMETRY · LIVE DATA ACTIVE
      </motion.p>
    </div>
  )
}

export default DashboardPage
