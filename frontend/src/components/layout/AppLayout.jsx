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
import NotificationPanel from './NotificationPanel.jsx'
import RankBadge from '../player/RankBadge.jsx'
import { fallbackPlayer, getStoredPlayer } from '../../data/mockDashboardData.js'
import { useNotifications } from '../../hooks/useNotifications.js'
import { authService } from '../../services/authService.js'
import { getEffectiveStreak, requiredXpForLevel } from '../../utils/xpUtils.js'

const navigationGroups = [
  {
    label: 'Player',
    items: [
      { label: 'Status', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Daily Quests', path: '/quests', icon: Swords },
      { label: 'Weekly Boss', path: '/boss', icon: Shield },
    ],
  },
  {
    label: 'Records',
    items: [
      { label: 'Analytics', path: '/analytics', icon: BarChart3 },
      { label: 'Progress', path: '/progress', icon: Sparkles },
      { label: 'Diary', path: '/diary', icon: BookOpen },
      { label: 'Expenses', path: '/expenses', icon: Coins },
      { label: 'Achievements', path: '/achievements', icon: Trophy },
    ],
  },
  {
    label: 'Hunter',
    items: [
      { label: 'Profile', path: '/profile', icon: UserRound },
      { label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
]
const navigation = navigationGroups.flatMap((group) => group.items)
const bottomNavigation = ['/dashboard', '/quests', '/boss', '/analytics', '/profile'].map((path) =>
  navigation.find((item) => item.path === path)
)

function Logo() {
  return (
    <NavLink to="/dashboard" className="group flex items-center gap-3" aria-label="Rankora home">
      <span className="relative grid h-9 w-9 place-items-center">
        <span className="absolute inset-0 rotate-45 border border-system-400 bg-system-500/15 shadow-[0_0_16px_rgba(30,144,255,0.5)] transition-shadow group-hover:shadow-[0_0_24px_rgba(30,144,255,0.8)]" />
        <span className="relative font-display text-lg font-bold text-frost-50 sys-glow">R</span>
      </span>
      <span className="sys-title text-xl tracking-[0.28em]">Rankora</span>
    </NavLink>
  )
}

function NavigationLink({ item, onNavigate }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 border-l-2 px-3 py-2 font-display text-[0.95rem] font-semibold uppercase tracking-[0.12em] transition-colors ${
          isActive
            ? 'border-system-400 bg-linear-to-r from-system-500/20 to-transparent text-frost-50 [text-shadow:0_0_10px_rgba(74,174,255,0.7)]'
            : 'border-transparent text-frost-400 hover:border-edge-strong hover:bg-void-850/60 hover:text-frost-100'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={16} className={isActive ? 'text-system-300' : 'text-frost-500 group-hover:text-frost-300'} />
          <span className="truncate">{item.label}</span>
          {isActive && <span className="ml-auto h-1.5 w-1.5 rotate-45 bg-system-300 shadow-[0_0_8px_rgba(74,174,255,1)]" />}
        </>
      )}
    </NavLink>
  )
}

function NavigationList({ onNavigate }) {
  return (
    <nav className="space-y-5" aria-label="System menu">
      {navigationGroups.map((group) => (
        <div key={group.label}>
          <p className="label-caps mb-1.5 flex items-center gap-2 px-3 text-frost-600">
            {group.label}
            <span className="h-px flex-1 bg-linear-to-r from-edge to-transparent" />
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavigationLink key={item.path} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function usePlayerVitals(player) {
  const level = Number(player.level) || 1
  const rank = player.rank || 'E'
  const streak = getEffectiveStreak(player)
  const currentXp = Number(player.xp) || 0
  const requiredXp = requiredXpForLevel(level)
  const xpPercentage = Math.min(100, Math.round((currentXp / requiredXp) * 100))
  return { level, rank, streak, currentXp, requiredXp, xpPercentage }
}

function MiniStatusWindow({ player, onLogout }) {
  const { level, rank, streak, currentXp, requiredXp, xpPercentage } = usePlayerVitals(player)
  return (
    <div className="space-y-3">
      <NavLink to="/profile" className="sys-panel block p-4 transition-[box-shadow] hover:[--panel-glow:rgba(30,144,255,0.32)]">
        <div className="flex items-center gap-3">
          <RankBadge rank={rank} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-bold uppercase tracking-[0.1em] text-frost-50">
              {player.playerName || 'Player'}
            </p>
            <p className="label-caps text-frost-500">{rank}-Rank Hunter</p>
          </div>
          <div className="text-right">
            <p className="label-caps text-frost-600">Lv</p>
            <p className="font-display text-2xl font-bold leading-none text-frost-50 sys-glow">{level}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="mb-1 flex justify-between font-mono text-[0.65rem] text-frost-500">
            <span className="text-system-300">EXP</span>
            <span>
              {currentXp.toLocaleString()}/{requiredXp.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 border border-edge bg-void-950">
            <div className="h-full bg-system-400 shadow-[0_0_8px_rgba(74,174,255,0.9)]" style={{ width: `${xpPercentage}%` }} />
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 font-mono text-xs text-ember-300">
          <Flame size={13} /> {streak}-day streak
        </p>
      </NavLink>

      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center justify-center gap-2 border border-penalty-500/30 bg-penalty-500/5 px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.18em] text-penalty-300 transition-colors hover:border-penalty-400/60 hover:bg-penalty-500/15"
      >
        <LogOut size={14} /> Log out
      </button>
    </div>
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

  const { level, rank, streak, xpPercentage } = usePlayerVitals(player)

  const currentPage =
    navigation.find((item) => item.path === location.pathname)?.label ||
    (location.pathname === '/quests/create'
      ? 'Create Quest'
      : location.pathname.startsWith('/quests/')
      ? 'Quest Info'
      : location.pathname === '/design-system'
      ? 'Design System'
      : 'Awakening')

  return (
    <div className="min-h-screen overflow-x-hidden text-frost-200">
      {/* Desktop System menu */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto border-r border-edge bg-void-950/90 px-4 py-6 shadow-[1px_0_24px_-8px_rgba(30,144,255,0.25)] backdrop-blur-md lg:flex">
        <div className="px-1">
          <Logo />
        </div>
        <div className="mt-9 flex-1">
          <NavigationList />
        </div>
        <div className="pt-6">
          <MiniStatusWindow player={player} onLogout={handleLogout} />
        </div>
      </aside>

      <div className="min-w-0 pb-20 lg:ml-64 lg:pb-0">
        {/* HUD top bar */}
        <header className="sticky top-0 z-20 border-b border-edge bg-void-950/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-360 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setMobileMenuOpen(true)}
                className="border border-transparent p-2 text-frost-400 hover:border-edge hover:text-frost-50 lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="lg:hidden">
                <Logo />
              </div>
              <div className="hidden min-w-0 items-center gap-2 lg:flex">
                <span className="label-caps text-frost-600">System</span>
                <span className="text-system-500">▸</span>
                <h1 className="truncate font-display text-lg font-bold uppercase tracking-[0.14em] text-frost-50">{currentPage}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-4 border-r border-edge pr-4 md:flex">
                <div className="flex items-center gap-2">
                  <RankBadge rank={rank} size="sm" />
                  <div>
                    <p className="label-caps leading-none text-frost-600">Level</p>
                    <p className="font-display text-lg font-bold leading-tight text-frost-50">{level}</p>
                  </div>
                </div>
                <div className="w-32">
                  <div className="mb-1 flex justify-between font-mono text-[0.6rem] text-frost-500">
                    <span className="text-system-300">EXP</span>
                    <span>{xpPercentage}%</span>
                  </div>
                  <div className="h-1.5 border border-edge bg-void-950">
                    <div className="h-full bg-system-400 shadow-[0_0_8px_rgba(74,174,255,0.9)]" style={{ width: `${xpPercentage}%` }} />
                  </div>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-sm text-ember-300" title="Current streak">
                  <Flame size={15} />
                  {streak}
                </span>
              </div>

              <div className="relative">
                <button
                  type="button"
                  aria-label="Open notifications"
                  onClick={() => setNotificationsOpen((open) => !open)}
                  className="relative grid h-9 w-9 place-items-center border border-edge bg-void-900 text-frost-300 transition-colors hover:border-system-400 hover:text-frost-50"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center bg-penalty-500 px-1 font-mono text-[0.58rem] font-bold text-frost-50 shadow-[0_0_10px_rgba(240,42,62,0.9)]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notificationsOpen && <NotificationPanel onClose={() => setNotificationsOpen(false)} />}
                </AnimatePresence>
              </div>

              <NavLink
                to="/profile"
                aria-label="Open player profile"
                className="grid h-9 w-9 place-items-center border border-shadow-400/40 bg-shadow-500/10 text-shadow-200 transition-colors hover:border-shadow-400 hover:shadow-[0_0_14px_rgba(155,107,255,0.5)]"
              >
                <CircleUserRound size={18} />
              </NavLink>

              <button
                type="button"
                aria-label="Logout session"
                title="Log out"
                onClick={handleLogout}
                className="hidden h-9 w-9 place-items-center border border-penalty-500/30 bg-penalty-500/5 text-penalty-300 transition-colors hover:border-penalty-400 hover:bg-penalty-500/15 sm:grid"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-360 px-4 py-7 sm:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-edge bg-void-950/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgba(30,144,255,0.35)] backdrop-blur-md lg:hidden"
        aria-label="Mobile navigation"
      >
        {bottomNavigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex min-w-0 flex-col items-center gap-1 py-2.5 font-display text-[0.65rem] font-bold uppercase tracking-widest transition-colors ${
                  isActive ? 'text-system-200 [text-shadow:0_0_8px_rgba(74,174,255,0.8)]' : 'text-frost-500 hover:text-frost-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute inset-x-4 top-0 h-0.5 bg-system-400 shadow-[0_0_8px_rgba(74,174,255,1)]" />}
                  <Icon size={18} />
                  <span className="max-w-full truncate px-1">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-void-950/80 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.aside
              className="flex h-full w-[min(19rem,86vw)] flex-col overflow-y-auto border-r border-system-700 bg-void-950 px-4 py-5 shadow-[0_0_40px_rgba(30,144,255,0.25)]"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between px-1">
                <Logo />
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border border-transparent p-2 text-frost-400 hover:border-edge hover:text-frost-50"
                >
                  <X size={19} />
                </button>
              </div>
              <div className="mt-8 flex-1">
                <NavigationList onNavigate={() => setMobileMenuOpen(false)} />
              </div>
              <div className="pt-6">
                <MiniStatusWindow
                  player={player}
                  onLogout={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AppLayout
