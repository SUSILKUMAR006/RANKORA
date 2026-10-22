import { motion } from 'framer-motion'
import {
  Bell,
  Camera,
  CheckCircle2,
  CheckCheck,
  ChevronRight,
  Crown,
  Flame,
  Shield,
  ShieldAlert,
  Skull,
  Sparkles,
  Trash2,
  Trophy,
  X,
  XCircle,
  Zap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications.js'
import { formatRelativeTime } from '../../utils/notificationUtils.js'

const iconMap = {
  CheckCircle2,
  XCircle,
  Trophy,
  Crown,
  Flame,
  Skull,
  Sparkles,
  Zap,
  Shield,
  ShieldAlert,
  Camera,
  Bell,
}

// Keys are the notification `tone` values stored with each notification
// (see notificationUtils): keep them as-is, only the styling is mapped.
const toneStyles = {
  emerald: {
    bg: 'border-clear-400/70 bg-clear-500/10 text-clear-300',
    dot: 'bg-clear-400',
  },
  rose: {
    bg: 'border-penalty-400/70 bg-penalty-500/10 text-penalty-300',
    dot: 'bg-penalty-400',
  },
  amber: {
    bg: 'border-gold-400/70 bg-gold-500/10 text-gold-300',
    dot: 'bg-gold-400',
  },
  cyan: {
    bg: 'border-system-400/70 bg-system-500/10 text-system-200',
    dot: 'bg-system-400',
  },
  violet: {
    bg: 'border-shadow-400/70 bg-shadow-500/10 text-shadow-300',
    dot: 'bg-shadow-400',
  },
}

const tabBase =
  'flex items-center gap-1.5 border px-3 py-1 font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] transition-colors'
const tabActive = 'border-system-400 bg-system-500/15 text-frost-50 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
const tabIdle = 'border-edge text-frost-400 hover:border-edge-strong hover:text-frost-100'
const iconButton = 'grid h-7 w-7 place-items-center border border-transparent text-frost-500 transition-colors'

function NotificationPanel({ onClose }) {
  const navigate = useNavigate()
  const {
    notifications,
    allNotifications,
    unreadCount,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications()

  const handleClose = () => {
    if (typeof onClose === 'function') onClose()
  }

  const handleNotificationClick = (item) => {
    if (!item.isRead) {
      markAsRead(item.id)
    }
    if (item.link) {
      navigate(item.link)
      handleClose()
    }
  }

  return (
    <motion.div
      className="fixed inset-x-3 top-16 z-50 origin-top sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+0.875rem)] sm:w-104"
      initial={{ opacity: 0, scaleY: 0.04, scaleX: 0.85 }}
      animate={{
        opacity: 1,
        scaleY: 1,
        scaleX: 1,
        transition: {
          scaleX: { duration: 0.14 },
          scaleY: { delay: 0.1, duration: 0.24, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.1 },
        },
      }}
      exit={{ opacity: 0, scaleY: 0.04, transition: { duration: 0.14 } }}
    >
      <div className="sys-panel overflow-hidden [--panel-glow:rgba(30,144,255,0.3)]">
        {/* Panel Header */}
        <header className="flex items-center justify-between gap-3 border-b border-edge px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative shrink-0">
              <span className="grid h-6 w-6 place-items-center border border-system-400 text-system-200">
                <Bell size={13} />
              </span>
              {unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center bg-system-500 px-0.5 font-mono text-[0.58rem] font-bold text-frost-50 shadow-[0_0_10px_rgba(30,144,255,0.9)]">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="label-caps text-[0.6rem] leading-3 text-frost-600">Rankora telemetry</p>
              <h2 className="sys-title truncate text-sm">
                <span className="text-system-400">[</span> Notifications <span className="text-system-400">]</span>
              </h2>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                title="Mark all as read"
                className="flex h-7 items-center gap-1.5 border border-edge px-2 font-display text-[0.68rem] font-bold uppercase tracking-[0.14em] text-system-200 transition-colors hover:border-system-400 hover:bg-system-500/15 hover:text-frost-50"
              >
                <CheckCheck size={13} />
                <span className="hidden sm:inline">Read all</span>
              </button>
            )}

            {allNotifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                title="Clear all notifications"
                className={`${iconButton} hover:border-penalty-400/60 hover:bg-penalty-500/10 hover:text-penalty-300`}
              >
                <Trash2 size={14} />
              </button>
            )}

            <button
              type="button"
              aria-label="Close notifications"
              onClick={handleClose}
              className={`${iconButton} hover:border-edge hover:text-frost-50`}
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 border-b border-edge/60 bg-void-950/60 px-4 py-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`${tabBase} ${filter === 'all' ? tabActive : tabIdle}`}
          >
            All <span className="font-mono text-[0.62rem] font-normal">[{allNotifications.length}]</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`${tabBase} ${filter === 'unread' ? tabActive : tabIdle}`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="font-mono text-[0.62rem] font-normal text-system-200">[{unreadCount}]</span>
            )}
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[min(24rem,calc(100dvh-17rem))] divide-y divide-edge/50 overflow-y-auto sm:max-h-96">
          {notifications.length > 0 ? (
            notifications.map((item, index) => {
              const Icon = iconMap[item.iconName] || Bell
              const tone = toneStyles[item.tone] || toneStyles.cyan

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: Math.min(index, 8) * 0.03, duration: 0.2 } }}
                  exit={{ opacity: 0, x: -8 }}
                  onClick={() => handleNotificationClick(item)}
                  className={`group relative flex cursor-pointer items-start gap-3 py-3 pl-5 pr-3 transition-colors duration-150 ${
                    item.isRead ? 'bg-transparent hover:bg-void-850/70' : 'bg-system-500/5 hover:bg-system-500/10'
                  }`}
                >
                  {/* Unread indicator: glowing system dot */}
                  {!item.isRead && (
                    <span className="absolute left-2 top-5 h-1.5 w-1.5 rotate-45 bg-system-300 shadow-[0_0_8px_rgba(74,174,255,1)]" />
                  )}

                  {/* [!] type icon, coloured by notification type */}
                  <span className={`relative grid h-8 w-8 shrink-0 place-items-center border ${tone.bg}`}>
                    <Icon size={15} />
                    <span
                      className={`absolute -bottom-px -right-px grid h-3 w-3 place-items-center font-display text-[0.55rem] font-bold leading-none text-void-950 ${tone.dot}`}
                    >
                      !
                    </span>
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p
                        className={`truncate font-display text-sm font-bold uppercase tracking-[0.06em] ${
                          item.isRead ? 'text-frost-300' : 'text-frost-50'
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="shrink-0 font-mono text-[0.62rem] text-frost-500">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>
                    <p className={`mt-0.5 line-clamp-2 text-xs leading-5 ${item.isRead ? 'text-frost-500' : 'text-frost-300'}`}>
                      {item.message}
                    </p>
                  </div>

                  {/* Row actions (always visible on touch, on hover from sm up) */}
                  <div className="flex shrink-0 items-center gap-0.5 self-center transition-opacity duration-150 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                    <button
                      type="button"
                      title="Delete notification"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(item.id)
                      }}
                      className="grid h-6 w-6 place-items-center border border-transparent text-frost-500 transition-colors hover:border-penalty-400/60 hover:bg-penalty-500/10 hover:text-penalty-300"
                    >
                      <Trash2 size={13} />
                    </button>
                    {item.link && (
                      <span className="text-frost-500 group-hover:text-system-300">
                        <ChevronRight size={14} />
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="px-6 py-12 text-center">
              <span className="mx-auto mb-3 grid h-10 w-10 place-items-center border border-dashed border-edge-strong text-frost-600">
                <Shield size={20} />
              </span>
              <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-frost-100">No notifications</p>
              <p className="mt-1 font-mono text-[0.68rem] text-frost-600">System telemetry channels clear.</p>
            </div>
          )}
        </div>

        {/* Panel Footer */}
        <footer className="flex items-center justify-between gap-3 border-t border-edge bg-void-950/70 px-4 py-2 font-mono text-[0.62rem] text-frost-600">
          <span>Auto-synced to localStorage</span>
          <span className="text-system-400/80">RANKORA v1.0</span>
        </footer>
      </div>
    </motion.div>
  )
}

export default NotificationPanel
