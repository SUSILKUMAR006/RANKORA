import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  Bell,
  BookOpen,
  CircleUserRound,
  Coins,
  Flame,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  UserRound,
  X,
} from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Badge from '../common/Badge.jsx'
import Card from '../common/Card.jsx'
import NotificationPanel from './NotificationPanel.jsx'
import SwordCursor from './SwordCursor.jsx'
import RankBadge from '../player/RankBadge.jsx'
import { fallbackPlayer, getStoredPlayer } from '../../data/mockDashboardData.js'
import { useNotifications } from '../../hooks/useNotifications.js'
import { authService } from '../../services/authService.js'
import { getEffectiveStreak, requiredXpForLevel } from '../../utils/xpUtils.js'

const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Daily Quests', path: '/quests', icon: Swords },
  { label: 'Expenses', path: '/expenses', icon: Coins },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Diary', path: '/diary', icon: BookOpen },
  { label: 'Progress', path: '/progress', icon: Sparkles },
  { label: 'Achievements', path: '/achievements', icon: Trophy },
  { label: 'Weekly Boss', path: '/boss', icon: Shield },
  { label: 'Profile', path: '/profile', icon: UserRound },
  { label: 'Settings', path: '/settings', icon: Settings },
]
const bottomNavigation = navigation.slice(0, 5)

function Logo() {
  return (
    <NavLink to="/dashboard" className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300 text-rankora-950 shadow-[0_0_24px_rgba(103,232,249,0.35)]">
        <Sparkles size={18} strokeWidth={2.5} />
      </span>
      <span className="font-display text-lg font-bold tracking-[0.16em]">RANKORA</span>
    </NavLink>
  )
}

function NavigationLink({ item, onNavigate, compact = false }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
          compact ? 'justify-center gap-1 px-1 text-[0.65rem]' : ''
        } ${
          isActive
            ? 'border border-cyan-300/30 bg-cyan-300/12 text-cyan-100 shadow-[inset_3px_0_0_#67e8f9,0_0_22px_rgba(103,232,249,0.08)]'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
        }`
      }
    >
      <Icon size={compact ? 15 : 17} className="shrink-0" />
      <span className={compact ? 'truncate' : ''}>{item.label}</span>
    </NavLink>
  )
}

function AppLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [player, setPlayer] = useState(() => getStoredPlayer() || fallbackPlayer)
  const { unreadCount } = useNotifications()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleUpdate = () => {
      setPlayer(getStoredPlayer() || fallbackPlayer)
    }
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('rankora-player-updated', handleUpdate)
    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('rankora-player-updated', handleUpdate)
    }
  }, [])

  const handleLogout = async () => {
    await authService.logout()
    navigate('/login')
  }

  const level = Number(player.level) || 1
  const rank = player.rank || 'E'
  const streak = getEffectiveStreak(player)
  const currentXp = Number(player.xp) || 0
  const requiredXp = requiredXpForLevel(level)
  const xpPercentage = Math.min(100, Math.round((currentXp / requiredXp) * 100))

  const currentPage =
    navigation.find((item) => item.path === location.pathname)?.label ||
    (location.pathname === '/quests/create'
      ? 'Create Quest'
      : location.pathname.startsWith('/quests/')
      ? 'Quest Details'
      : location.pathname === '/design-system'
      ? 'Design System'
      : 'Awakening')

  return (
    <div className="min-h-screen overflow-x-hidden bg-rankora-950 text-slate-100 lg:flex">
      <SwordCursor />

      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-rankora-950/90 backdrop-blur-xl px-4 py-6 lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:h-screen lg:z-30 lg:overflow-y-auto">
        <Logo />
        <p className="label-caps mb-3 mt-8 px-3 text-slate-600">Navigation</p>
        <nav className="space-y-1" aria-label="Sidebar navigation">
          {navigation.map((item) => (
            <NavigationLink key={item.path} item={item} />
          ))}
        </nav>

        <div className="mt-auto pt-6 space-y-3">
          {/* Current Run Card */}
          <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/4 p-4">
            <p className="label-caps text-cyan-300/60">Current run</p>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-slate-300 font-mono">
                <Flame size={16} className="text-orange-300" />
                {streak} days
              </span>
              <Badge tone="success">Active</Badge>
            </div>
          </div>

          {/* Dedicated Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/5 px-3 py-2.5 font-mono text-xs text-rose-300 transition hover:border-rose-400/40 hover:bg-rose-400/15"
          >
            <LogOut size={14} /> DISCONNECT SESSION
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="min-w-0 flex-1 pt-18 pb-20 lg:pb-0 lg:ml-64">
        {/* Fixed Topbar */}
        <header className="fixed top-0 left-0 right-0 lg:left-64 z-30 border-b border-white/10 bg-rankora-950/90 backdrop-blur-xl">
          <div className="mx-auto flex h-18 max-w-360 items-center justify-between gap-4 px-5 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="lg:hidden">
                <Logo />
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="label-caps text-slate-600">Current module</p>
                <h1 className="mt-1 truncate font-display text-lg font-semibold text-white">
                  {currentPage}
                </h1>
              </div>
            </div>

            {/* Topbar Right Profile & Telemetry Controls */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 sm:flex">
                <div className="text-right">
                  <p className="label-caps text-slate-600">Level</p>
                  <p className="font-mono text-sm text-white">{level}</p>
                </div>
                <RankBadge rank={rank} size="sm" />
                <div className="w-28">
                  <div className="mb-1 flex justify-between font-mono text-[0.6rem] text-slate-500">
                    <span>XP</span>
                    <span>{xpPercentage}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-cyan-300 to-blue-400"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                </div>
                <span className="flex items-center gap-1.5 border-l border-white/10 pl-3 font-mono text-xs text-orange-200">
                  <Flame size={15} />
                  {streak}
                </span>
              </div>

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="Open notifications"
                  onClick={() => setNotificationsOpen((open) => !open)}
                  className="relative rounded-xl border border-white/10 bg-white/4 p-2.5 text-slate-400 transition hover:border-cyan-300/30 hover:text-cyan-200"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-cyan-300 px-1 font-mono text-[0.58rem] font-bold text-rankora-950 shadow-[0_0_10px_#67e8f9]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notificationsOpen && (
                    <NotificationPanel onClose={() => setNotificationsOpen(false)} />
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Avatar Button */}
              <NavLink
                to="/profile"
                aria-label="Open player profile"
                className="grid h-9 w-9 place-items-center rounded-xl border border-violet-300/25 bg-violet-400/10 text-violet-200 transition hover:border-violet-300/50 hover:bg-violet-400/20"
              >
                <CircleUserRound size={19} />
              </NavLink>

              {/* Header Logout Action */}
              <button
                type="button"
                aria-label="Logout session"
                title="Disconnect Session"
                onClick={handleLogout}
                className="hidden sm:grid h-9 w-9 place-items-center rounded-xl border border-rose-400/25 bg-rose-400/10 text-rose-300 transition hover:border-rose-400/50 hover:bg-rose-400/20"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mx-auto w-full max-w-360 px-5 py-7 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 grid min-w-0 grid-cols-5 overflow-hidden border-t border-white/10 bg-rankora-950/90 px-2 py-2 backdrop-blur-xl lg:hidden"
        aria-label="Mobile navigation"
      >
        {bottomNavigation.map((item) => (
          <NavigationLink key={item.path} item={item} compact />
        ))}
      </nav>

      {/* Mobile Slideout Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-rankora-950/80 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.aside
              className="h-full w-[min(19rem,86vw)] border-r border-white/10 bg-rankora-900 px-4 py-6 flex flex-col"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                >
                  <X size={19} />
                </button>
              </div>

              <p className="label-caps mb-3 mt-8 px-3 text-slate-600">All modules</p>
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <NavigationLink
                    key={item.path}
                    item={item}
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                ))}
              </nav>

              <div className="mt-auto pt-6 space-y-3">
                <Card variant="glass" className="p-4">
                  <p className="label-caps text-slate-600">Player status</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="font-mono text-sm text-white">LVL {level}</span>
                    <Badge tone="rank">Rank {rank}</Badge>
                  </div>
                </Card>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2.5 font-mono text-xs text-rose-300 transition hover:bg-rose-400/20"
                >
                  <LogOut size={15} /> LOGOUT SESSION
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AppLayout
