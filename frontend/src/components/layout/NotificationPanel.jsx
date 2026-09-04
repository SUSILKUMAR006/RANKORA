import { motion } from 'framer-motion'
import {
  Bell,
  Camera,
  Check,
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
import Card from '../common/Card.jsx'
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

const toneStyles = {
  emerald: {
    bg: 'bg-emerald-400/10 border-emerald-400/25 text-emerald-300',
    dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
  },
  rose: {
    bg: 'bg-rose-400/10 border-rose-400/25 text-rose-300',
    dot: 'bg-rose-400 shadow-[0_0_8px_#fb7185]',
  },
  amber: {
    bg: 'bg-amber-400/10 border-amber-400/25 text-amber-300',
    dot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
  },
  cyan: {
    bg: 'bg-cyan-400/10 border-cyan-400/25 text-cyan-200',
    dot: 'bg-cyan-300 shadow-[0_0_8px_#67e8f9]',
  },
  violet: {
    bg: 'bg-violet-400/10 border-violet-400/25 text-violet-300',
    dot: 'bg-violet-400 shadow-[0_0_8px_#a78bfa]',
  },
}

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

  const handleNotificationClick = (item) => {
    if (!item.isRead) {
      markAsRead(item.id)
    }
    if (item.link) {
      navigate(item.link)
      onClose()
    }
  }

  return (
    <motion.div
      className="absolute right-0 top-14 z-50 w-[min(26rem,calc(100vw-1.5rem))] origin-top-right"
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Card
        variant="glass"
        className="relative overflow-hidden border-cyan-300/25 p-0 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      >
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />

        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-400/10 text-cyan-200">
                <Bell size={15} />
              </span>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-cyan-300 text-[0.58rem] font-bold text-rankora-950 shadow-[0_0_10px_#67e8f9]">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <p className="label-caps text-[0.6rem] text-cyan-300/80">RANKORA TELEMETRY</p>
              <h2 className="font-display text-sm font-semibold text-white">NOTIFICATIONS</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                title="Mark all as read"
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[0.65rem] text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
              >
                <CheckCheck size={13} />
                <span className="hidden sm:inline">READ ALL</span>
              </button>
            )}

            {allNotifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                title="Clear all notifications"
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300"
              >
                <Trash2 size={14} />
              </button>
            )}

            <button
              type="button"
              aria-label="Close notifications"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 border-b border-white/5 bg-black/20 px-4 py-2 text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-wider transition ${
              filter === 'all'
                ? 'bg-cyan-300/15 text-cyan-100 border border-cyan-300/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            All ({allNotifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-wider transition ${
              filter === 'unread'
                ? 'bg-cyan-300/15 text-cyan-100 border border-cyan-300/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="rounded bg-cyan-300/20 px-1 py-0.2 text-[0.6rem] text-cyan-200">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 divide-y divide-white/5 overflow-y-auto pr-0.5">
          {notifications.length > 0 ? (
            notifications.map((item) => {
              const Icon = iconMap[item.iconName] || Bell
              const tone = toneStyles[item.tone] || toneStyles.cyan

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  onClick={() => handleNotificationClick(item)}
                  className={`group relative flex cursor-pointer items-start gap-3.5 px-4 py-3.5 transition duration-150 ${
                    item.isRead
                      ? 'bg-transparent hover:bg-white/[0.03]'
                      : 'bg-cyan-400/[0.04] hover:bg-cyan-400/[0.08]'
                  }`}
                >
                  {/* Unread Indicator Bar / Dot */}
                  {!item.isRead && (
                    <span
                      className={`absolute left-1 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full ${tone.dot}`}
                    />
                  )}

                  {/* Icon Container */}
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${tone.bg}`}
                  >
                    <Icon size={16} />
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display text-xs font-semibold text-white truncate">
                        {item.title}
                      </p>
                      <span className="shrink-0 font-mono text-[0.62rem] text-slate-500">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.72rem] leading-relaxed text-slate-400 line-clamp-2">
                      {item.message}
                    </p>
                  </div>

                  {/* Hover Delete Action */}
                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <button
                      type="button"
                      title="Delete notification"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(item.id)
                      }}
                      className="rounded-md p-1 text-slate-500 hover:bg-rose-400/20 hover:text-rose-300"
                    >
                      <Trash2 size={13} />
                    </button>
                    {item.link && (
                      <span className="text-slate-500">
                        <ChevronRight size={14} />
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="py-12 text-center text-slate-500">
              <Shield size={28} className="mx-auto mb-2 text-slate-600" />
              <p className="font-display text-xs font-semibold text-white">
                NO NOTIFICATIONS
              </p>
              <p className="mt-1 font-mono text-[0.68rem] text-slate-600">
                System telemetry channels clear.
              </p>
            </div>
          )}
        </div>

        {/* Panel Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-black/30 px-4 py-2.5 font-mono text-[0.65rem] text-slate-500">
          <span>Auto-synced to localStorage</span>
          <span className="text-cyan-300/70">RANKORA v1.0</span>
        </div>
      </Card>
    </motion.div>
  )
}

export default NotificationPanel
