import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import PublicOnlyRoute from './components/auth/PublicOnlyRoute.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import AchievementsPage from './pages/AchievementsPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import AwakeningPage from './pages/AwakeningPage.jsx'
import BossPage from './pages/BossPage.jsx'
import CreateQuestPage from './pages/CreateQuestPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import DesignSystemPage from './pages/DesignSystemPage.jsx'
import DiaryPage from './pages/DiaryPage.jsx'
import ExpenseTrackerPage from './pages/ExpenseTrackerPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'
import QuestDetailsPage from './pages/QuestDetailsPage.jsx'
import QuestsPage from './pages/QuestsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          {/* Public Routes (Accessible only when logged out) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <AuthPage mode="login" />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <AuthPage mode="register" />
              </PublicOnlyRoute>
            }
          />

          {/* Awakening Ritual (Protected, requires logged-in user) */}
          <Route
            path="/awakening"
            element={
              <ProtectedRoute allowUnawakened={true}>
                <AwakeningPage />
              </ProtectedRoute>
            }
          />

          {/* Main Application Layout (Protected, requires awakened logged-in user) */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes location={location}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/quests" element={<QuestsPage />} />
                    <Route path="/quests/create" element={<CreateQuestPage />} />
                    <Route path="/quests/:id" element={<QuestDetailsPage />} />
                    <Route path="/expenses" element={<ExpenseTrackerPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/diary" element={<DiaryPage />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/achievements" element={<AchievementsPage />} />
                    <Route path="/boss" element={<BossPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/design-system" element={<DesignSystemPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default App
