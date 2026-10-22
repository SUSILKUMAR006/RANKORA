import { ChevronRight, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import SystemWindow from '../common/SystemWindow.jsx'
import { getLatestUnlockedAchievement } from '../../utils/achievementUtils.js'

function RecentAchievement({ achievement }) {
  const current = achievement || getLatestUnlockedAchievement() || {}
  const Icon = current.icon || Trophy
  const title = current.title || 'FIRST AWAKENING'
  const detail = current.detail || 'Unlocked on registration'

  return (
    <SystemWindow
      title="Recent Achievement"
      tone="shadow"
      icon={<Trophy size={13} />}
      actions={
        <Link
          to="/achievements"
          aria-label="View achievements"
          className="label-caps inline-flex items-center gap-1 text-shadow-300 transition-colors hover:text-frost-50"
        >
          <span className="hidden sm:inline">Records</span> <ChevronRight size={14} />
        </Link>
      }
    >
      <div className="flex items-center gap-5">
        <span className="relative grid h-16 w-16 shrink-0 place-items-center">
          <span className="absolute inset-2 rotate-45 border border-shadow-400/80 bg-shadow-500/15 shadow-[0_0_22px_rgba(127,69,245,0.55),inset_0_0_12px_rgba(155,107,255,0.35)]" />
          <Icon size={22} className="relative text-shadow-100 drop-shadow-[0_0_6px_rgba(155,107,255,0.8)]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="label-caps text-shadow-300">Achievement unlocked</p>
          <h2 className="mt-1 font-display text-xl font-bold uppercase leading-tight tracking-[0.08em] text-frost-50 [text-shadow:0_0_14px_rgba(155,107,255,0.6)]">
            {title}
          </h2>
          <p className="mt-1 text-sm text-frost-400">{detail}</p>
        </div>
      </div>
    </SystemWindow>
  )
}
export default RecentAchievement
